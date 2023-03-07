import { ethers } from "ethers";

// Creates a new contract object on each call - better way to do this?
export async function deposit(address, abi, amount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(address, abi, provider)
    const contractWithSigner = contract.connect(signer)

    await contractWithSigner.deposit(amount)
};

