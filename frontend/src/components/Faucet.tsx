// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import {
	CheckCircleTwoTone,
	CloseCircleTwoTone,
	FundOutlined,
	LoadingOutlined,
	RedoOutlined,
} from "@ant-design/icons";
import {
	Alert,
	App,
	Avatar,
	Button,
	Card,
	Divider,
	List,
	Space,
	Spin,
	Typography,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import {
	GetFaucetSolutions,
	StartFaucetSearch,
} from "../../wailsjs/go/main/App";
import type { backend } from "wailsjs/go/models";

const { Text, Title, Paragraph } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Faucet = () => {
	const { message } = App.useApp();
	const [loaded, setLoaded] = useState(false);
	const [search, setSearch] = useState<backend.FaucetSearchInfo | null>(null);
	const [solutions, setSolutions] = useState<backend.FaucetSearchInfo[]>([]);

	const startSearch = async () => {
		try {
			const newSearch = await StartFaucetSearch();
			setSearch(newSearch);
		} catch (error) {
			message.error("Failed to start the search. Please try again.");
		}
	};

	const getFaucetSolutions = useCallback(async () => {
		try {
			const faucetSolutions = await GetFaucetSolutions();
			// TODO: simplify
			faucetSolutions.alerts?.forEach((alert) => {
				message[alert.type](alert.content);
			});
			setSearch(faucetSolutions.current_search ?? null);
			setSolutions(faucetSolutions.past_searches);
			setLoaded(true);
		} catch (error) {
			message.error(
				"Failed to fetch faucet solutions. Please refresh the page.",
			);
		}
	}, [message]);

	useEffect(() => {
		getFaucetSolutions();
		const interval = setInterval(getFaucetSolutions, 10000); // Refresh every 10 seconds

		return () => clearInterval(interval);
	}, [getFaucetSolutions]);

	return (
		<div
			style={{
				maxWidth: "600px",
				margin: "auto",
				padding: "20px",
				overflowWrap: "break-word",
			}}
		>
			<Space direction="vertical" size="large" style={{ width: "100%" }}>
				<Card>
					<Title level={3} style={{ textAlign: "center" }}>
						Token Faucet
					</Title>
					<Paragraph style={{ textAlign: "center" }}>
						This faucet provides test tokens for users on the Nuklai network. To
						request tokens, solve a simple computational puzzle to demonstrate
						your commitment and help prevent abuse.
					</Paragraph>
					{!loaded ? (
						<Spin
							indicator={antIcon}
							style={{ display: "flex", justifyContent: "center" }}
						/>
					) : (
						<>
							{search ? (
								<Space
									direction="vertical"
									size="middle"
									style={{ display: "flex", justifyContent: "center" }}
								>
									<Spin indicator={antIcon} />
									<Text>Your request is being processed...</Text>
									<Button type="default" icon={<RedoOutlined spin />} disabled>
										Request Pending
									</Button>
								</Space>
							) : (
								<div style={{ display: "flex", justifyContent: "center" }}>
									<Button
										type="primary"
										icon={<FundOutlined />}
										onClick={startSearch}
									>
										Request Tokens
									</Button>
								</div>
							)}
						</>
					)}
				</Card>

				{solutions.length > 0 && (
					<>
						<Divider>Past Requests</Divider>
						<List
							itemLayout="horizontal"
							dataSource={solutions}
							renderItem={(item) => (
								<List.Item>
									<List.Item.Meta
										avatar={
											item.err ? (
												<Avatar
													icon={<CloseCircleTwoTone twoToneColor="#f5222d" />}
												/>
											) : (
												<Avatar
													icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
												/>
											)
										}
										title={
											<Text>
												{item.err ? "Request Failed" : "Tokens Received"}
											</Text>
										}
										description={
											<Space direction="vertical">
												<Text style={{ wordBreak: "break-all" }}>
													<strong>Solution:</strong> {item.solution}
												</Text>
												<Text>
													<strong>Salt:</strong> {item.salt}
												</Text>
												<Text>
													<strong>Difficulty:</strong> {item.difficulty}
												</Text>
												<Text>
													<strong>Attempts:</strong> {item.attempts}
												</Text>
												{item.err ? (
													<Alert message={item.err} type="error" showIcon />
												) : (
													<>
														<Text>
															<strong>Received:</strong> {item.amount}
														</Text>
														<Text>
															<strong>Transaction ID:</strong> {item.tx_id}
														</Text>
													</>
												)}
											</Space>
										}
									/>
								</List.Item>
							)}
						/>
					</>
				)}
			</Space>
		</div>
	);
};

export default Faucet;
