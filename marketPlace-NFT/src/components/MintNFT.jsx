import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ArbitrumNFT from "../contracts/ArbitrumNFT.json";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import axios from "axios";

function MintNFT() {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nfts, setNfts] = useState([]);

  const contractAddress = "0xC718D5978303E714562c79763183C19F7A688F92"; // Replace with your contract address
  const contractABI = ArbitrumNFT.abi;

  useEffect(() => {
    fetchNFTs();
  }, [account, status]);

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        const arbitrumSepoliaChainId = "0x66eee"; // 421614 in hexadecimal

        if (chainId !== arbitrumSepoliaChainId) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: arbitrumSepoliaChainId }],
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: arbitrumSepoliaChainId,
                      chainName: "Arbitrum Sepolia",
                      rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
                      nativeCurrency: {
                        name: "Ethereum",
                        symbol: "ETH",
                        decimals: 18,
                      },
                      blockExplorerUrls: [
                        "https://sepolia-explorer.arbitrum.io",
                      ],
                    },
                  ],
                });
              } catch (addError) {
                console.error(
                  "Error adding Arbitrum Sepolia network:",
                  addError
                );
              }
            } else {
              console.error("Error switching network:", switchError);
            }
            return;
          }
        }

        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle name input change
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  // Handle description input change
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // Upload image to firebase
  const uploadImageToFirebase = async () => {
    if (!file) {
      alert("Please select an image file.");
      return null;
    }

    try {
      // Create a storage reference
      const storageRef = ref(storage, `images/${file.name}`);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);

      // Get the download URL
      const imageURL = await getDownloadURL(snapshot.ref);

      return imageURL;
    } catch (error) {
      console.error("Error uploading image to Firebase Storage:", error);
      setStatus(`Error uploading image to Firebase Storage: ${error.message}`);
      return null;
    }
  };

  // Upload metadata to firebase
  const uploadMetadataToFirebase = async (imageURL) => {
    if (!name || !description || !imageURL) {
      alert("Please provide name, description, and image.");
      return null;
    }

    const metadata = {
      name,
      description,
      image: imageURL,
    };

    try {
      // Convert metadata to a Blob
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });

      // Create a storage reference
      const metadataRef = ref(storage, `metadata/${name}.json`);

      // Upload the metadata
      const snapshot = await uploadBytes(metadataRef, metadataBlob);

      // Get the download URL
      const metadataURL = await getDownloadURL(snapshot.ref);

      return metadataURL;
    } catch (error) {
      console.error("Error uploading metadata to Firebase Storage:", error);
      setStatus(
        `Error uploading metadata to Firebase Storage: ${error.message}`
      );
      return null;
    }
  };

  // Mint NFT function
  const mintNFT = async () => {
    if (!account) {
      alert("Please connect your wallet.");
      return;
    }

    setStatus("Uploading image to Firebase Storage...");

    try {
      // Upload image to Firebase Storage
      const imageURL = await uploadImageToFirebase();
      if (!imageURL) {
        setStatus("Failed to upload image to Firebase Storage.");
        return;
      }
      console.log("Image URL:", imageURL);

      setStatus("Uploading metadata to Firebase Storage...");

      // Upload metadata to Firebase Storage
      const metadataURL = await uploadMetadataToFirebase(imageURL);
      if (!metadataURL) {
        setStatus("Failed to upload metadata to Firebase Storage.");
        return;
      }
      console.log("Metadata URL:", metadataURL);

      setStatus("Minting NFT...");

      // Interact with smart contract using ethers.js v6 syntax
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nftContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      console.log("nftContract:", nftContract);

      const txn = await nftContract.mintNFT(metadataURL);
      console.log("Transaction sent:", txn);

      const receipt = await txn.wait();
      console.log("Transaction receipt:", receipt);

      setStatus(`NFT Minted! Transaction Hash: ${txn.hash}`);

      // Optionally, fetch the updated list of NFTs
      fetchNFTs();
    } catch (error) {
      console.error("Error minting NFT:", error);
      const errorMessage = error.reason || error.data?.message || error.message;
      setStatus(`Error minting NFT: ${errorMessage}`);
    }
  };

  // Fetch metadata from Firebase Storage
  const fetchMetadata = async (metadataURL) => {
    try {
      const response = await axios.get(metadataURL);
      return response.data;
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return null;
    }
  };

  // Fetch NFTs owned by the user (optional)
  //   const fetchNFTs = async () => {
  //     if (!account) return;

  //     try {
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       const nftContract = new ethers.Contract(contractAddress, contractABI, provider);

  //       const balance = await nftContract.balanceOf(account);
  //       let tokens = [];

  //       for (let i = 0; i < balance.toNumber(); i++) {
  //         const tokenId = await nftContract.tokenOfOwnerByIndex(account, i);
  //         const tokenURI = await nftContract.tokenURI(tokenId);
  //         tokens.push({ tokenId: tokenId.toString(), tokenURI });
  //       }

  //       setNfts(tokens);
  //     } catch (error) {
  //       console.error('Error fetching NFTs:', error);
  //     }
  //   };
  const fetchNFTs = async () => {
    if (!account) return;

    setStatus("Fetching your NFTs...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const nftContract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const balanceBigInt = await nftContract.balanceOf(account);
      const balance = balanceBigInt.toNumber();

      console.log("NFT Balance:", balance);

      let tokens = [];

      for (let i = 0; i < balance; i++) {
        const tokenIdBigInt = await nftContract.tokenOfOwnerByIndex(account, i);
        const tokenId = tokenIdBigInt.toString();
        console.log(`Token ID ${i}:`, tokenId);

        // Get the Token URI (metadata URL)
        const tokenURI = await nftContract.tokenURI(tokenId);
        console.log(`Token URI for Token ID ${tokenId}:`, tokenURI);

        // Fetch metadata from Firebase Storage
        const metadata = await fetchMetadata(tokenURI);
        console.log(`Metadata for Token ID ${tokenId}:`, metadata);

        tokens.push({
          tokenId,
          metadata,
        });
      }

      setNfts(tokens);
      setStatus("");
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setStatus(`Error fetching NFTs: ${error.message}`);
    }
  };

  return (
    <div className="w-[80%] mx-auto mt-20">
        <div>
            <h1 className="text-center text-4xl font-semibold pt-2 text-white">Mint an NFT</h1>
        </div>
      <button onClick={connectWallet} className="px-5 mb-2 rounded-xl py-1 bg-white text-base">
        {account
          ? `Connected: ${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`
          : "Connect Wallet"}
      </button>

      <div className="flex pb-10 glass">
      <div className="p-4 w-[50%]">
      <div className="">
        <h2 className="text-white pb-2">Mint Your NFT: </h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <input
          type="text"
          className="p-2 mt-2 mb-2 rounded-xl w-full"
          placeholder="Enter NFT Name"
          value={name}
          onChange={handleNameChange}
          size="50"
        />
        <br />
        <textarea
          placeholder="Enter NFT Description"
          className="p-2 mt-2 mb-2 rounded-xl w-full"
          value={description}
          onChange={handleDescriptionChange}
          
        />
        <br />
        <button onClick={mintNFT} className="px-6 rounded-xl py-2 bg-white text-base">Mint NFT</button>
      </div>

      <p>{status}</p>
      </div>

      <div className="w-[50%] p-4 text-white">
        <h2 className="text-center">Your NFTs</h2>
        {nfts.length > 0 ? (
          nfts.map((nft, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <p>
                <strong>Token ID:</strong> {nft.tokenId}
              </p>
              {nft.metadata ? (
                <>
                  <p>
                    <strong>Name:</strong> {nft.metadata.name}
                  </p>
                  <p>
                    <strong>Description:</strong> {nft.metadata.description}
                  </p>
                  {nft.metadata.image && (
                    <img
                      src={nft.metadata.image}
                      alt={nft.metadata.name}
                      style={{ maxWidth: "200px" }}
                    />
                  )}
                </>
              ) : (
                <p>Metadata not available.</p>
              )}
            </div>
          ))
        ) : (
          <p>You have no NFTs yet.</p>
        )}
      </div>
      </div>
    </div>
  );
}

export default MintNFT;
