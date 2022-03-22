import type { NextPage } from 'next';
import { useEffect, useState, useRef } from 'react';
import ethers from 'ethers';
import Web3Modal from 'web3modal';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { WHITELIST_CONTRACT_ADDY, abi } from '../constants';

const Home: NextPage = () => {
	// STATE
	const [walletConnected, setWalletConnected] = useState(false);
	const [loading, setLoading] = useState(false);
	const [joinedWhitelist, setJoinedWhitelist] = useState(false);
	const [numWhitelisted, setNumWhitelisted] = useState(0);
	const web3ModalRef = useRef();

	const getProviderOrSigner = async (needSigner = false) => {
		const provider = await web3ModalRef.current.connect();
		const web3Provider = new ethers.providers.Web3Provider(provider);

		if (needSigner) {
			const signer = web3Provider.getSigner();
			return signer;
		}
		return web3Provider;
	};

	const addToWhitelist = async () => {
		try {
			const signer = await getProviderOrSigner(true);
			const whitelistContract = new ethers.Contract(
				WHITELIST_CONTRACT_ADDY,
				abi,
				signer
			);

			const txn = await whitelistContract.addToWhitelist();
			setLoading(true);
			await txn.wait();
			setJoinedWhitelist(true);
		} catch (err) {
			console.error(err);
		}
	};

	const removeFromWhitelist = async () => {
		try {
			const signer = await getProviderOrSigner(true);
			const whitelistContract = new ethers.Contract(
				WHITELIST_CONTRACT_ADDY,
				abi,
				signer
			);
			const txn = await whitelistContract.removeFromWhitelist();
			setLoading(true);
			await txn.wait();
			setJoinedWhitelist(false);
		} catch (err) {
			console.error(err);
		}
	};

	const numCurrentlyWhitelisted = async () => {
		try {
			const provider = await getProviderOrSigner();
			const whitelistContract = new ethers.Contract(
				WHITELIST_CONTRACT_ADDY,
				abi,
				provider
			);
			const num = await whitelistContract.numCurrentlyWhitelisted();
			setNumWhitelisted(num);
		} catch (err) {
			console.error(err);
		}
	};

	const addressInWhitelist = async () => {
		const signer = await getProviderOrSigner(true);
		const whitelistContract = new ethers.Contract(
			WHITELIST_CONTRACT_ADDY,
			abi,
			signer
		);
		const addy = await ethers.utils.getAddress(signer.toString());
		const temp = await whitelistContract.allWhitelisted(addy);
		setJoinedWhitelist(temp);
	};

	const connectWallet = async () => {
		try {
			await getProviderOrSigner();
			setWalletConnected(true);
		} catch (err) {
			console.error(err);
		}
	};

	const button = () => {
		if (walletConnected) {
			if (joinedWhitelist) {
				return <div>You have now joined the whitelist!</div>;
			} else if (loading) {
				return <button>Loading...</button>;
			} else {
				return <button onClick={addToWhitelist}>Join the whitelist!</button>;
			}
		} else {
			return (
				<button onClick={connectWallet}>
					Connect your wallet to join the whitelist!
				</button>
			);
		}
	};

	return (
		<div>
			<Head>
				<title>Whitelist Me</title>
				<meta name='description' content='Whitelist Me' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div>
				<h1>Welcome to Whitelist Me!</h1>
				<h3>
					This is an easy frontend to interact with my Whitelistooor contract;
					the full code can be found here:
				</h3>
				<a href='https://github.com/0xGenghisGoose/whitelistooor'>
					Whitelistooor on GitHub
				</a>
				<div>{numWhitelisted}/10 spots left on the whitelist!</div>
				{button()}
			</div>
		</div>
	);
};

export default Home;
