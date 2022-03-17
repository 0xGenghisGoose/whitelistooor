import type { NextPage } from 'next';
import { useEffect, useState, useRef } from 'react';
import ethers from 'ethers';
import Web3Modal from 'web3modal';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

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
      const whitelistContract = new ethers.Contract(WHITELIST_CONTRACT_ADDY, abi, signer);
    }
  }

	return (
		<div className={styles.container}>
			<Head>
				<title>Whitelist Me</title>
				<meta name='description' content='Whitelist Me' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div></div>
		</div>
	);
};

export default Home;
