import type { NextPage } from 'next';
import { useEffect, useState, useRef, MutableRefObject } from 'react';
import { ethers } from 'ethers';
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
	const [userAddy, setUserAddy]: any = useState();
	const web3ModalRef: MutableRefObject<any> = useRef();

	const getProviderOrSigner = async (needSigner = false) => {
		const provider = await web3ModalRef.current.connect();
		const web3Provider = new ethers.providers.Web3Provider(provider);

		const userAcct = web3Provider.getSigner();
		const userAddress = await userAcct.getAddress();
		setUserAddy(userAddress);

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
			const txn = await whitelistContract.addToWhitelist(userAddy);
			setLoading(true);
			await txn.wait();
			setJoinedWhitelist(true);
			numCurrentlyWhitelisted();
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
		const temp = await whitelistContract.whitelisted(addy);
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
				return (
					<button className='rounded-md bg-cyan-400 text-lg py-4 px-4 mt-8'>
						Loading...
					</button>
				);
			} else {
				return (
					<button
						className='rounded-md bg-cyan-400 hover:bg-cyan-300 text-lg py-4 px-4 mt-8'
						onClick={addToWhitelist}>
						Join the whitelist!
					</button>
				);
			}
		} else {
			return (
				<button
					className='rounded-md shadow-lg bg-cyan-400 hover:bg-cyan-300 text-lg py-4 px-4 mt-4'
					onClick={connectWallet}>
					Connect Your Wallet
				</button>
			);
		}
	};

	useEffect(() => {
		if (!walletConnected) {
			web3ModalRef.current = new Web3Modal({
				network: 'rinkeby',
				providerOptions: {},
				disableInjectedProvider: false,
			});
		}
		numCurrentlyWhitelisted();
	}, [walletConnected, joinedWhitelist]);

	return (
		<div className='bg-gradient-to-r from-[#D7D1D1] via-[#f5f5f5] to-[#D7D1D1]'>
			<Head>
				<title>Whitelist Me</title>
				<meta name='description' content='Whitelist Me' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='flex w-80 absolute top-20 left-12'>
				<img src='./exhausted_computer_user.png' alt='comp' />
			</div>

			<div className='min-h-[90vh] min-w-[75%] justify-center flex flex-col items-center leading-8 tracking-wide'>
				<h1 className='pb-20 text-5xl'>
					Welcome to <span className='text-green-400'>Whitelist Me!</span>
				</h1>
				<br />
				<div className='text-lg leading-10'>
					This is an easy frontend to interact with my Whitelistooor contract
				</div>
				<div className='text-lg'>The full code can be found below:</div>
				<a
					className='pt-4 text-green-400 text-xl'
					href='https://github.com/0xGenghisGoose/whitelistooor'>
					Whitelistooor on GitHub
				</a>
				<br />
				<div className='text-2xl pt-4'>
					{numWhitelisted} / 10 whitelist spots claimed
				</div>
				<br />
				{button()}
				<div className='flex w-96 ml-4 absolute bottom-20 right-12'>
					<img className='' src='./sleeping_user.png' alt='sleep' />
				</div>
			</div>

			<footer className='flex justify-center bg-green-400 shadow-xl mt-12 py-4 font-semibold'>
				Hastily thrown together by
				<a
					className='pl-1 text-rose-400'
					href='https://github.com/0xgenghisgoose'>
					0xGenghisGoose
				</a>
			</footer>
		</div>
	);
};

export default Home;
