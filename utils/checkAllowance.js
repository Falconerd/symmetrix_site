import { ethers } from "ethers";

export async function checkAllowance(address, abi) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(address, abi, provider)

    return await contract.allowance(await signer.getAddress(), address)
};


