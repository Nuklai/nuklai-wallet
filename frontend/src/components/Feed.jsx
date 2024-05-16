import { InfoCircleOutlined } from '@ant-design/icons'
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
  Typography
} from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import {
  GetBalance,
  GetFeed,
  GetFeedInfo,
  Message,
  OpenLink,
  Transfer as Send
} from '../../wailsjs/go/main/App'
import FundsCheck from './FundsCheck'

const { Text, Paragraph } = Typography

const Feed = () => {
  const { message } = App.useApp()
  const [feed, setFeed] = useState([])
  const [feedInfo, setFeedInfo] = useState({})
  const [openCreate, setOpenCreate] = useState(false)
  const [createForm] = Form.useForm()
  const [openTip, setOpenTip] = useState(false)
  const [tipFocus, setTipFocus] = useState({})
  const [tipForm] = Form.useForm()
  const [balance, setBalance] = useState([])

  // Helper function to convert timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const getBalance = useCallback(async () => {
    const bals = await GetBalance()
    const parsedBalances = bals.map((bal) => ({
      value: bal.ID,
      label: bal.Bal
    }))
    setBalance(parsedBalances)
  }, [])

  // Fetch data for the feed and user's balance
  useEffect(() => {
    const fetchData = async () => {
      const [feedData, feedInfoData] = await Promise.all([
        GetFeed(25), // Fetch only the last 25 feeds
        GetFeedInfo()
      ])
      getBalance()
      setFeed(feedData)
      setFeedInfo(feedInfoData)
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [getBalance])

  // Handle creating a new post
  const onFinishCreate = async (values) => {
    const loadingMessageKey = 'processingFeedTransaction'

    setOpenCreate(false)
    message.loading({
      content: 'Processing Transaction...',
      key: loadingMessageKey
    })
    try {
      await Message(values.Message, values.URL)
      message.success({
        content: 'Transaction Successful!',
        key: loadingMessageKey,
        duration: 5
      })
      // Refetch the feed after posting
      setFeed(await GetFeed(25)) // Fetch only the last 25 feeds
    } catch (error) {
      message.error({
        content: error.toString(),
        key: loadingMessageKey,
        duration: 5
      })
    }
  }

  // Handle sending a tip
  const onFinishTip = async (values) => {
    const loadingMessageKey = 'processingTipTransaction' // Unique key for the loading message

    setOpenTip(false)
    message.loading({
      content: 'Processing Transaction...',
      key: loadingMessageKey
    })
    try {
      // Convert the Amount to a string
      const amountAsString = values.Amount.toString()

      const start = new Date().getTime()
      await Send(
        values.Asset,
        tipFocus.Address,
        amountAsString,
        `[${tipFocus.ID}]: ${values.Memo}`
      )
      const finish = new Date().getTime()

      // Calculate the duration in seconds
      const durationInSeconds = ((finish - start) / 1000).toFixed(2)

      // Update the message to success after the transaction is finalized and include the duration in seconds
      message.success({
        content: `Tip sent successfully in (${durationInSeconds} seconds)`,
        key: loadingMessageKey, // Use the same key to update the existing message
        duration: 5 // Set how long the success message will stay (optional)
      })

      // Update the balance after tipping
      setBalance(await GetBalance())
    } catch (error) {
      message.error({
        content: error.toString(),
        key: loadingMessageKey,
        duration: 5
      })
    }
  }

  return (
    <>
      <div style={{ width: '60%', margin: 'auto' }}>
        <FundsCheck />
        <Divider orientation='center'>
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
          type='primary'
          onClick={() => setOpenCreate(true)}
          disabled={!window.HasBalance}
        >
          Create Post
        </Button>
        <List
          itemLayout='vertical'
          size='large'
          dataSource={feed}
          renderItem={(item) => (
            <List.Item
              key={item.ID}
              actions={[
                <Button
                  onClick={() => {
                    setTipFocus(item)
                    setOpenTip(true)
                  }}
                >
                  Tip
                </Button>
              ]}
              extra={
                item.URLMeta?.Image && (
                  <img width={272} alt='thumbnail' src={item.URLMeta.Image} />
                )
              }
            >
              <List.Item.Meta
                title={
                  item.URLMeta ? (
                    <a onClick={() => OpenLink(item.URL)}>
                      {item.URLMeta.Title}
                    </a>
                  ) : (
                    <Text>{item.Message}</Text>
                  )
                }
                description={item.URLMeta?.Description}
              />
              <div>
                <Text strong>URL:</Text> {item.URL}
                <br />
                <Text strong>Message:</Text> {item.Message}
                <br />
                <Text strong>TxID:</Text> {item.ID}
                <br />
                <Text strong>Timestamp:</Text> {formatTimestamp(item.Timestamp)}
                <br />
                <Text strong>Fee:</Text> {item.Fee}
                <br />
                <Text strong>Actor:</Text> <Text copyable>{item.Address}</Text>
                <br />
                <Text strong>SubnetID:</Text> {item.SubnetID}
                <br />
                <Text strong>ChainID:</Text> {item.ChainID}
              </div>
            </List.Item>
          )}
        />
      </div>

      <Drawer
        title='Create Post'
        placement='right'
        onClose={() => setOpenCreate(false)}
        open={openCreate}
      >
        <Form form={createForm} onFinish={onFinishCreate}>
          <Form.Item name='Message' rules={[{ required: true }]}>
            <Input placeholder='Enter your message' />
          </Form.Item>
          <Form.Item name='URL'>
            <Input placeholder='Add a link (optional)' />
          </Form.Item>
          <Button type='primary' htmlType='submit'>
            Post
          </Button>
        </Form>
      </Drawer>

      <Drawer
        title='Send Tip'
        placement='right'
        onClose={() => setOpenTip(false)}
        open={openTip}
      >
        <Form form={tipForm} onFinish={onFinishTip}>
          <Form.Item name='Asset' rules={[{ required: true }]}>
            <Select options={balance} placeholder='Select token' />
          </Form.Item>
          <Form.Item name='Amount' rules={[{ required: true }]}>
            <InputNumber placeholder='Amount' style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='Memo'>
            <Input placeholder='Add a message (optional)' />
          </Form.Item>
          <Button type='primary' htmlType='submit'>
            Tip
          </Button>
        </Form>
      </Drawer>
    </>
  )
}

export default Feed
