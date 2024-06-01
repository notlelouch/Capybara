import {
  CryptoDevsDAOABI,
  CryptoDevsDAOAddress,
  CryptoDevsNFTABI,
  CryptoDevsNFTAddress,
} from "../constants";
import { BigNumberish } from "@ethersproject/bignumber";
import { config } from "../config";
import { useCallback } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from "react";
import { formatEther } from "viem/utils";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { readContract, waitForTransactionReceipt, writeContract} from "wagmi/actions";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const [ isMounted, setIsMounted ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ fakeNFTokenId, setFakeNFTokenId ] = useState("");
  const [ proposals, setProposals ] = useState<Proposal[]>([]);
  const [ selectedTab, setSelectedTab ] = useState("");

  const daoOwner = useReadContract({
    abi: CryptoDevsDAOABI,
    address: CryptoDevsDAOAddress,
    functionName: "owner",
  });

  const daoBalance = useBalance({
    address: CryptoDevsDAOAddress,
  });

  const numOfProposalsInDAO = useReadContract({
    abi: CryptoDevsDAOABI,
    address: CryptoDevsDAOAddress,
    functionName: "numProposals",
  });

  const nftBalanceOfUser = useReadContract({
    abi: CryptoDevsNFTABI,
    address: CryptoDevsNFTAddress,
    functionName: "balanceOf",
    args: [address],
  });

  // ######################################## no args given at the start of the function
  async function createProposal() {
    setLoading(true);
    try {
      const tx = await writeContract(config, {
        address: CryptoDevsDAOAddress,
        abi: CryptoDevsDAOABI,
        functionName: "createProposal",
        args: [fakeNFTokenId],
      });

      await waitForTransactionReceipt(config, {
        hash: tx,
      });
    } catch (e) {
      console.error(e);
      window.alert(e);
    }
    setLoading(false);
  }

  interface Proposal {
    proposalId: number;
    nftTokenID: string;
    deadline: Date;
    yayVotes: string;
    nayVotes: string;
    executed: boolean;
  }

  const fetchProposalById = useCallback(async (id: number): Promise<Proposal> => {
    try {
      const proposal = await readContract(config, {
        address: CryptoDevsDAOAddress,
        abi: CryptoDevsDAOABI,
        functionName: "proposals",
        args: [id],
      });

      const [
        nftTokenID,
        deadline,
        yayVotes,
        nayVotes,
        executed,
      ] = proposal as [
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        boolean
      ];

      const parsedProposal: Proposal = {
        proposalId: id,
        nftTokenID: nftTokenID.toString(),
        deadline: new Date(parseInt(deadline.toString()) * 1000),
        yayVotes: yayVotes.toString(),
        nayVotes: nayVotes.toString(),
        executed: Boolean(executed),
      };

      return parsedProposal;
    } catch (e) {
      console.error(e);
      window.alert(e);
      throw e; // Rethrow the error to propagate it
    }
  }, []);


  const fetchAllProposals = useCallback(async (): Promise<Proposal[]> => {
    try {
      const proposals: Proposal[] = [];
      for (let i = 0; i < (numOfProposalsInDAO.data as number); i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals);
      return proposals;
    } catch (e) {
      console.error(e);
      window.alert(e);
      return [];
    }
  }, [numOfProposalsInDAO.data, fetchProposalById]);


  // async function fetchAllProposals(): Promise<Proposal[]> {
  //   try {
  //     const proposals: Proposal[] = [];
  
  //     for (let i = 0; i < (numOfProposalsInDAO.data as number); i++) {
  //       const proposal = await fetchProposalById(i);
  //       proposals.push(proposal);
  //     }
  
  //     setProposals(proposals);
  //     return proposals;
  //   } catch (e) {
  //     console.error(e);
  //     window.alert(e); 
  //     return [];
  //   }
  // }

  async function voteForProposal(proposalId: number, vote: "YAY" | "NAY") {
    setLoading(true); 

    try {
      const tx = await writeContract(config, {
        address: CryptoDevsDAOAddress,
        abi: CryptoDevsDAOABI,
        functionName: "voteOnProposal",
        args: [proposalId, vote === "YAY" ? 0 : 1]
      });

      await waitForTransactionReceipt(config, {
        hash: tx,
      });
    } catch (e) {
      console.error(e);
      window.alert(e); 
    }
    setLoading(false);
  }

  async function executeProposal(proposalId: number) {
    setLoading(true); 

    try {
      const tx = await writeContract(config, {
        address: CryptoDevsDAOAddress,
        abi: CryptoDevsDAOABI,
        functionName: "executeProposal",
        args: [proposalId],
      });

      await waitForTransactionReceipt(config, {
        hash: tx,
      });
    } catch (e) {
      console.error(e);
      window.alert(e); 
    }

    setLoading(false);
  }

  async function withdrawDAOEther() {
    setLoading(true);

    try {
      const tx = await writeContract(config,{
        address: CryptoDevsDAOAddress,
        abi: CryptoDevsDAOABI,
        functionName: "withdrawEther",
      });

      await waitForTransactionReceipt(config, {
        hash: tx,
      });
    } catch (e) {
      console.error(e);
      window.alert(e); 
    }

    setLoading(false);
  }

  // Render the contents of the appropriate tab based on `selectedTab`
  function renderTabs(): JSX.Element | null {
    if (selectedTab === "Create Proposal") {
      return renderCreateProposalTab();
    } else if (selectedTab === "View Proposals") {
      return renderViewProposalsTab();
    }
    return null;
  }

  function renderCreateProposalTab() {
    if (loading) {
      return (
        <div className={styles.description}>
          Loading... Waiting for transaction...
        </div>
      );
    } else if (nftBalanceOfUser.data === 0) {
      return (
        <div className={styles.description}>
          You do not own any CryptoDevs NFTs. <br />
          <b>You cannot create or vote on proposals</b>
        </div>
      );
    } else {
      return (
        <div className={styles.container}>
          <label>Fake NFT Token ID to Purchase: </label>
          <input
            placeholder="0"
            type="number"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFakeNFTokenId(e.target.value)
            }
          />
          <button className={styles.button2} onClick={createProposal}>
            Create
          </button>
        </div>
      );
    }
  }
  
  function renderViewProposalsTab() {
    if (loading) {
      return (
        <div className={styles.description}>
          Loading... Waiting for transaction...
        </div>
      );
    } else if (proposals.length === 0) {
      return (
        <div className={styles.description}>No proposals have been created</div>
      );
    } else {
      return (
        <div>
          {proposals.map((p: Proposal, index: number) => (
            <div key={index} className={styles.card}>
              <p>Proposal ID: {p.proposalId}</p>
              <p>Fake NFT to Purchase: {p.nftTokenID}</p>
              <p>Deadline: {p.deadline.toLocaleString()}</p>
              <p>Yay Votes: {p.yayVotes}</p>
              <p>Nay Votes: {p.nayVotes}</p>
              <p>Executed?: {p.executed.toString()}</p>
              {p.deadline.getTime() > Date.now() && !p.executed ? (
                <div className={styles.flex}>
                  <button
                    className={styles.button2}
                    onClick={() => voteForProposal(p.proposalId, "YAY")}
                  >
                    Vote YAY
                  </button>
                  <button
                    className={styles.button2}
                    onClick={() => voteForProposal(p.proposalId, "NAY")}
                  >
                    Vote NAY
                  </button>
                </div>
              ) : p.deadline.getTime() < Date.now() && !p.executed ? (
                <div className={styles.flex}>
                  <button
                    className={styles.button2}
                    onClick={() => executeProposal(p.proposalId)}
                  >
                    Execute Proposal{" "}
                    {p.yayVotes > p.nayVotes ? "(YAY)" : "(NAY)"}
                  </button>
                </div>
              ) : (
                <div className={styles.description}>Proposal Executed</div>
              )}
            </div>
          ))}
        </div>
      );
    }
  }

  useEffect(() => {
    if (selectedTab === "View Proposals") {
      fetchAllProposals();
    }
  }, [selectedTab, fetchAllProposals]);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return null;
  
  if (!isConnected)
    return (
      <div>
        <ConnectButton />
      </div>
    );

  // return (
  //   <div className={inter.className}>

  //     <main className={styles.main}>
  //       <ConnectButton />


  //       <h1>chut teri maa ki</h1>
  //     </main>

  //     <footer className={styles.footer}>
  //       <a href="https://github.com/notlelouch" rel="noopener noreferrer" target="_blank">
  //         Made by daddy 🦾
  //       </a>
  //     </footer>
  //   </div>
  // );

  return (
    <div className={inter.className}>
      <Head>
        <title>CryptoDevs DAO</title>
        <meta name="description" content="CryptoDevs DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>Welcome to the DAO!</div>
          <div className={styles.description}>
            Your CryptoDevs NFT Balance: {nftBalanceOfUser.data ? (nftBalanceOfUser.data as number).toString() : "Loading..."}
            <br />
            {daoBalance.data && (
              <>
                Treasury Balance:{" "}
                {formatEther(daoBalance.data.value).toString()} ETH
              </>
            )}
            <br />
            Total Number of Proposals: {numOfProposalsInDAO.data ? (numOfProposalsInDAO.data as number).toString() : "Loading..."}
          </div>
          <div className={styles.flex}>
            <button
              className={styles.button}
              onClick={() => setSelectedTab("Create Proposal")}
            >
              Create Proposal
            </button>
            <button
              className={styles.button}
              onClick={() => setSelectedTab("View Proposals")}
            >
              View Proposals
            </button>
          </div>
          {renderTabs()}
          {address && daoOwner.data ? (
          address.toLowerCase() === (daoOwner.data as string).toLowerCase() ? (
            <div>
              {loading ? (
                <button className={styles.button}>Loading...</button>
              ) : (
                <button className={styles.button} onClick={withdrawDAOEther}>
                  Withdraw DAO ETH
                </button>
              )}
            </div>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        </div>
      </div>
    </div>
  );
};

export default Home;
