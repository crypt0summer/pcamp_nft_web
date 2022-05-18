import { ethers } from "ethers";
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const checkEmptyAddr = (val: any) => {
  return val ? val: "EMPTY_ADDRESS_ENV"
};

export const getTreeAndWL = async () => {
  let wl : {key: string, value: number}[] = [
    // { key: "0xcA3266F30f72fB8cF41b3A697338bAFA59435Eba", value: 0 },
    // { key: checkEmptyAddr(process.env.REACT_APP_WL_TEST), value: 1 },
    // { key: "0x58e2211855a45706e6A9c084CaA4Ae35DFA50325", value: 2 },
    {key: (checkEmptyAddr(process.env.REACT_APP_WL0)), value: 0},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL1)), value: 1},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL2)), value: 2},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL3)), value: 3},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL4)), value: 4},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL5)), value: 5},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL6)), value: 6},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL7)), value: 7},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL8)), value: 8},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL9)), value: 9},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL10)), value: 10},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL11)), value: 11},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL12)), value: 12},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL13)), value: 13},
    {key: (checkEmptyAddr(process.env.REACT_APP_WL14)), value: 14},
  ];

  const leaves = wl.map((object) =>
    ethers.utils.solidityKeccak256(
      ["address", "uint256"], [object.key, object.value]
    )
  );

  const tree = new MerkleTree(leaves, keccak256, { sort: true }); //sortPairs
  console.log(tree.toString());

  return {tree, wl};
};


export const getTokenId = (address: string, wl : {key: string, value: number}[]) => {
  console.log(wl);
  const found = wl.find(element => element.key === address);

  console.log(found);

  const value = found? found.value : -1;
  return value;
};

export const getHexProof = async (tree: any, addr: string, tokenId: number) => {
  const hexProof = tree.getHexProof(
    ethers.utils.solidityKeccak256(["address", "uint256"], [addr, tokenId])
  );

  // console.log("헥스", hexProof);

  return hexProof;
};
