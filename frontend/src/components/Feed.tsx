// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { InfoCircleOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  List,
  Popover,
  Select,
  Typography,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import type { backend } from 'wailsjs/go/models';

import {
  GetBalance,
  GetFeed,
  GetFeedInfo,
  Message,
  OpenLink,
  Transfer as Send,
} from '../../wailsjs/go/main/App';
import FundsCheck from './FundsCheck';

const Feed = () => {
  const { message } = App.useApp();
  const [feed, setFeed] = useState<backend.FeedObject[]>([]);
  const [_, setFeedInfo] = useState<backend.FeedInfo | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm] = Form.useForm();
  const [openTip, setOpenTip] = useState(false);
  const [tipFocus, setTipFocus] = useState<backend.FeedObject | null>(null);
  const [tipForm] = Form.useForm();
  const [balance, setBalance] = useState<backend.BalanceInfo[]>([]);

  // Helper function to convert timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getBalance = useCallback(async () => {
    // TODO: to rewrite. Getter is not a setter.
    const bals = await GetBalance();
    const parsedBalances = bals.map((bal) => ({
      value: bal.id,
      label: bal.bal,
    }));
    setBalance(parsedBalances);
  }, []);

  // Fetch data for the feed and user's balance
  useEffect(() => {
    const fetchData = async () => {
      const [feedData, feedInfoData] = await Promise.all([
        GetFeed(25), // Fetch only the last 25 feeds
        GetFeedInfo(),
      ]);
      getBalance();
      setFeed(feedData);
      setFeedInfo(feedInfoData);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [getBalance]);

  // Handle creating a new post
  const onFinishCreate = async (values: { message: string; url: string }) => {
    const loadingMessageKey = 'processingFeedTransaction';

    setOpenCreate(false);
    message.loading({
      content: 'Processing Transaction...',
      key: loadingMessageKey,
      duration: 0,
    });
    try {
      await Message(values.message, values.url);
      message.success({
        content: 'Transaction Successful!',
        key: loadingMessageKey,
        duration: 5,
      });
      // Refetch the feed after posting
      setFeed(await GetFeed(25)); // Fetch only the last 25 feeds
    } catch (error) {
      if (!(error instanceof Error)) return;

      message.error({
        content: error.toString(),
        key: loadingMessageKey,
        duration: 5,
      });
    }
  };

  // Handle sending a tip
  const onFinishTip = async (values: {
    asset: string;
    amount: number;
    memo: string;
  }) => {
    const loadingMessageKey = 'processingTipTransaction'; // Unique key for the loading message

    if (!tipFocus) return;

    setOpenTip(false);
    message.loading({
      content: 'Processing Transaction...',
      key: loadingMessageKey,
      duration: 0,
    });
    try {
      // Convert the Amount to a string
      const amountAsString = values.amount.toString();

      const start = new Date().getTime();
      await Send(
        values.asset,
        tipFocus.address,
        amountAsString,
        `[${tipFocus.id}]: ${values.memo}`,
      );
      const finish = new Date().getTime();

      // Calculate the duration in seconds
      const durationInSeconds = ((finish - start) / 1000).toFixed(2);

      // Update the message to success after the transaction is finalized and include the duration in seconds
      message.success({
        content: `Tip sent successfully in (${durationInSeconds} seconds)`,
        key: loadingMessageKey, // Use the same key to update the existing message
        duration: 5, // Set how long the success message will stay (optional)
      });

      // Update the balance after tipping
      setBalance(await GetBalance());
    } catch (error) {
      if (!(error instanceof Error)) return;

      message.error({
        content: error.toString(),
        key: loadingMessageKey,
        duration: 5,
      });
    }
  };

  return (
    <>
      <div style={{ width: '60%', margin: 'auto' }}>
        <FundsCheck />
        <Divider orientation="center">
          Posts
          <Popover
            content={
              <div>
                <p>
                  Because the fees are low on NuklaiNet, it is great for
                  micropayments.
                </p>
                <p>
                  This example allows anyone to pay the feed operator to post
                  content for everyone else to see.
                </p>
                <p>
                  If the amount of posts goes above the target/5 minutes, the
                  fee to post will increase.
                </p>
                <p>You can tip posters with any token you own!</p>
              </div>
            }
          >
            <InfoCircleOutlined />
          </Popover>
        </Divider>
        <Button
          type="primary"
          onClick={() => setOpenCreate(true)}
          disabled={!window.HasBalance} // TODO: remove
        >
          Create Post
        </Button>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={feed}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                // biome-ignore lint/correctness/useJsxKeyInIterable: List is static. Can be ignored.
                <Button
                  onClick={() => {
                    setTipFocus(item);
                    setOpenTip(true);
                  }}
                >
                  Tip
                </Button>,
              ]}
              extra={
                item.url_meta?.image && (
                  <img width={272} alt="thumbnail" src={item.url_meta.image} />
                )
              }
            >
              <List.Item.Meta
                title={
                  item.url_meta ? (
                    // biome-ignore lint/a11y/useValidAnchor: TODO
                    <a onClick={() => OpenLink(item.url)}>
                      {item.url_meta.title}
                    </a>
                  ) : (
                    <Typography.Text>{item.message}</Typography.Text>
                  )
                }
                description={item.url_meta?.description}
              />
              <div>
                <Typography.Text strong>URL:</Typography.Text> {item.url}
                <br />
                <Typography.Text strong>Message:</Typography.Text>{' '}
                {item.message}
                <br />
                <Typography.Text strong>TxID:</Typography.Text> {item.id}
                <br />
                <Typography.Text strong>Timestamp:</Typography.Text>{' '}
                {formatTimestamp(item.timestamp)}
                <br />
                <Typography.Text strong>Fee:</Typography.Text> {item.fee}
                <br />
                <Typography.Text strong>Actor:</Typography.Text>{' '}
                <Typography.Text copyable>{item.address}</Typography.Text>
                <br />
                <Typography.Text strong>SubnetID:</Typography.Text>{' '}
                {item.subnet_id}
                <br />
                <Typography.Text strong>ChainID:</Typography.Text>{' '}
                {item.chain_id}
              </div>
            </List.Item>
          )}
        />
      </div>

      <Drawer
        title="Create Post"
        placement="right"
        onClose={() => setOpenCreate(false)}
        open={openCreate}
      >
        <Form form={createForm} onFinish={onFinishCreate}>
          <Form.Item name="message" rules={[{ required: true }]}>
            <Input placeholder="Enter your message" />
          </Form.Item>
          <Form.Item name="url">
            <Input placeholder="Add a link (optional)" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Post
          </Button>
        </Form>
      </Drawer>

      <Drawer
        title="Send Tip"
        placement="right"
        onClose={() => setOpenTip(false)}
        open={openTip}
      >
        <Form form={tipForm} onFinish={onFinishTip}>
          <Form.Item name="asset" rules={[{ required: true }]}>
            <Select options={balance} placeholder="Select token" />
          </Form.Item>
          <Form.Item name="amount" rules={[{ required: true }]}>
            <InputNumber placeholder="Amount" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="memo">
            <Input placeholder="Add a message (optional)" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Tip
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default Feed;
