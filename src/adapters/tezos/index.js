import { BeaconWallet } from "@taquito/beacon-wallet";
import { MichelsonMap, TezosToolkit } from "@taquito/taquito";
import { InMemorySigner, importKey } from "@taquito/signer";

const DAPP_NAME = "SpaceOz";
const RPC_URL = "https://jakartanet.smartpy.io";
const NETWORK = "jakartanet";
const IGT_CONTRACT_ADDRESS = "KT1GFjj3DCzzqAGP8nnt9Hm3rMtqem4KBAFp";
const INVENTORY_CONTRACT_ADDRESS = "KT1AaQqifT3smqNGpPkBmPqXLQP8yGjqJr63";

const Tezos = new TezosToolkit(RPC_URL);

const wallet = new BeaconWallet({
  name: DAPP_NAME,
  preferredNetwork: NETWORK,
  colorMode: "dark",
});

// Setting the wallet as the wallet provider for Taquito.
Tezos.setWalletProvider(wallet);

const network = {
  type: NETWORK,
  rpcUrl: RPC_URL,
};

const getActiveAccount = async () => {
  const activeAccount = await wallet.client.getActiveAccount();
  return activeAccount;
};

const connectAccount = async () => {
  const activeAccount = await wallet.client.getActiveAccount();
  // no active account, we need permissions first
  if (!activeAccount) {
    await wallet.requestPermissions({ network });
    return getActiveAccount();
  }
  return activeAccount;
};

const clearActiveAccount = async () => {
  return wallet.client.clearActiveAccount();
};

const getBalance = async () => {
  const wallet = await getActiveAccount();
  if (!wallet) {
    return 0;
  }
  return await Tezos.tz
    .getBalance(wallet.address)
    .then((balance) => balance.toNumber() / 1000000)
    .catch((error) => console.error(JSON.stringify(error)));
};

const getIGTContract = async () => {
  return Tezos.wallet.at(IGT_CONTRACT_ADDRESS);
};
const getInventoryContract = async () => {
  return Tezos.wallet.at(INVENTORY_CONTRACT_ADDRESS);
};

const getIGTContractStorage = async () => {
  return (await getIGTContract()).storage();
};
const getInventoryContractStorage = async () => {
  return (await getInventoryContract()).storage();
};

const buyItemWithXTZ = async (amount, token_id) => {
  getActiveAccount().then((account) => {
    getInventoryContract()
      .then((contract) => {
        return contract.methods.mint_existing(account.address, token_id).send({
          amount: amount,
          mutez: true,
        });
      })
      .catch((error) =>
        window.alert(`Error: ${JSON.stringify(error, null, 2)}`)
      );
  });
};
const buyItemWithSPZ = async (amount, token_id) => {
  getActiveAccount().then((account) => {
    getIGTContract()
      .then((contract) => {
        return contract.methods
          .exchange(amount, INVENTORY_CONTRACT_ADDRESS, token_id)
          .send();
      })
      .catch((error) =>
        window.alert(`Error: ${JSON.stringify(error, null, 2)}`)
      );
  });
};

const minSPZTokens = async (amount, to_) => {
  console.log(amount, to_);
  Tezos.setProvider({
    signer: new InMemorySigner(process.env.REACT_APP_PRIVATE_KEY),
  });
  await Tezos.contract
    .at(IGT_CONTRACT_ADDRESS)
    .then((contract) => {
      return contract.methods.mint(amount, to_).send();
    })
    .catch((error) => window.alert(`Error: ${JSON.stringify(error, null, 2)}`));
  Tezos.setWalletProvider(wallet);
};

// const mint = async ({ url, price, title }) => {
//   return await getContract().then((c) => {
//     return c.methods
//       .mint(
//         price,
//         title,
//         url,
//       )
//       .send();
//   });
// };
// const confirmOperation = async (operation) => {
//   console.log(`Awaiting for ${operation.opHash} to be confirmed...`);
//   return operation.confirmation(1).then(() => operation.opHash);
// };

// const collect = async ({ token_id, price }) => {
//   return await getContract().then((c) => {
//     return c.methods.collect(token_id).send({
//       amount: price,
//       mutez: true,
//     });
//   });
// };

// const updatePrice = async ({ token_id, price }) => {
//   return await getContract().then((c) => {
//     return c.methods.update(price, token_id).send();
//   });
// };

export {
  Tezos,
  wallet,
  getActiveAccount,
  connectAccount,
  clearActiveAccount,
  getIGTContract,
  getInventoryContract,
  getIGTContractStorage,
  getInventoryContractStorage,
  getBalance,
  buyItemWithXTZ,
  buyItemWithSPZ,
  minSPZTokens,
  //   updatePrice,
  //   mint as createItem,
  //   confirmOperation,
  //   collect as createSale,
};
