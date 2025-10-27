import { Abi } from "viem"

export async function StreamsABI(): Promise<Abi> {
    return [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "initialOwner",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "EventSchemaAlreadyRegistered",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EventSchemaNotRegistered",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "EventTopicAlreadyRegistered",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "IDAlreadyUsed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "IdentityAlreadyExists",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "IdentityDoesNotExist",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "IncorrectNumberOfTopics",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidArrayLength",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidDataLength",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidIdentity",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSelfReference",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "MaxArrayLengthExceeded",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoCalldata",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoData",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ParentSchemaNotRegistered",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "SchemaAlreadyRegistered",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "SchemaNotRegistered",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TooManyIndexedParams",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TooManyTopics",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Unauthorized",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "publisher",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "dataId",
          "type": "bytes32"
        }
      ],
      "name": "ESStoreEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "eventTopic",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "emitter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isEmitter",
          "type": "bool"
        }
      ],
      "name": "EmitterUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        }
      ],
      "name": "IdentityCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        }
      ],
      "name": "IdentityDeleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "enum RoleControl.Role",
          "name": "role",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isOpen",
          "type": "bool"
        }
      ],
      "name": "IsRoleOpenSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bool",
          "name": "bypassed",
          "type": "bool"
        }
      ],
      "name": "RoleChecksBypassToggled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "enum RoleControl.Role",
          "name": "role",
          "type": "uint8"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "enum RoleControl.Role",
          "name": "role",
          "type": "uint8"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        }
      ],
      "name": "SchemaRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "eventTopic",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "id",
          "type": "string"
        }
      ],
      "name": "SchemaRegistered",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "MAX_NUM_EVM_INDEXED_PARAMS",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "bypassRoleChecks",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "schemaSpec",
          "type": "string"
        }
      ],
      "name": "computeSchemaId",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "walletAddress",
          "type": "address"
        },
        {
          "internalType": "enum RoleControl.Role[]",
          "name": "initialRoles",
          "type": "uint8[]"
        }
      ],
      "name": "createWalletIdentity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        }
      ],
      "name": "deleteIdentity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "id",
              "type": "string"
            },
            {
              "internalType": "bytes32[]",
              "name": "argumentTopics",
              "type": "bytes32[]"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "internalType": "struct EventSource.EventData[]",
          "name": "events",
          "type": "tuple[]"
        }
      ],
      "name": "emitEvents",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "id",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "schemaId",
              "type": "bytes32"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "internalType": "struct DataSchemaLibrary.DataStream[]",
          "name": "dataStreams",
          "type": "tuple[]"
        }
      ],
      "name": "esstores",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "topic",
          "type": "bytes32"
        }
      ],
      "name": "eventIdFromTopic",
      "outputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllIdentities",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "walletAddress",
              "type": "address"
            },
            {
              "internalType": "enum RoleControl.Role[]",
              "name": "roles",
              "type": "uint8[]"
            }
          ],
          "internalType": "struct RoleControl.IdentityView[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "publisher",
          "type": "address"
        }
      ],
      "name": "getAllPublisherDataForSchema",
      "outputs": [
        {
          "internalType": "bytes[]",
          "name": "",
          "type": "bytes[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllRegisteredEventIds",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllSchemas",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllWallets",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "idx",
          "type": "uint256"
        }
      ],
      "name": "getEventIdAtIndex",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "ids",
          "type": "string[]"
        }
      ],
      "name": "getEventSchemasById",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "paramType",
                  "type": "string"
                },
                {
                  "internalType": "bool",
                  "name": "isIndexed",
                  "type": "bool"
                }
              ],
              "internalType": "struct EventSource.Parameter[]",
              "name": "params",
              "type": "tuple[]"
            },
            {
              "internalType": "bytes32",
              "name": "eventTopic",
              "type": "bytes32"
            }
          ],
          "internalType": "struct EventSource.EventSchema[]",
          "name": "schemas",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "publisher",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "idx",
          "type": "uint256"
        }
      ],
      "name": "getPublisherDataForSchemaAtIndex",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "idx",
          "type": "uint256"
        }
      ],
      "name": "getSchema",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "parentSchemaId_",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "schema",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalNumberOfRegisteredEventSchemas",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        },
        {
          "internalType": "enum RoleControl.Role",
          "name": "role",
          "type": "uint8"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        }
      ],
      "name": "idToSchemaId",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "topic",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "caller",
          "type": "address"
        }
      ],
      "name": "isCallerAuthorisedEmitter",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isEmitter",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        }
      ],
      "name": "isSchemaRegistered",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isRegistered",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "emitter",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isEmitter",
          "type": "bool"
        }
      ],
      "name": "manageEventEmitter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        }
      ],
      "name": "parentSchemaId",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "parent",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "id",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "schemaId",
              "type": "bytes32"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "internalType": "struct DataSchemaLibrary.DataStream[]",
          "name": "dataStreams",
          "type": "tuple[]"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "id",
              "type": "string"
            },
            {
              "internalType": "bytes32[]",
              "name": "argumentTopics",
              "type": "bytes32[]"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "internalType": "struct EventSource.EventData[]",
          "name": "events",
          "type": "tuple[]"
        }
      ],
      "name": "publishDataAndEmitEvents",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "publisher",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "key",
          "type": "bytes32"
        }
      ],
      "name": "publisherDataIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "ids",
          "type": "string[]"
        },
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "paramType",
                  "type": "string"
                },
                {
                  "internalType": "bool",
                  "name": "isIndexed",
                  "type": "bool"
                }
              ],
              "internalType": "struct EventSource.Parameter[]",
              "name": "params",
              "type": "tuple[]"
            },
            {
              "internalType": "bytes32",
              "name": "eventTopic",
              "type": "bytes32"
            }
          ],
          "internalType": "struct EventSource.EventSchema[]",
          "name": "schemas",
          "type": "tuple[]"
        }
      ],
      "name": "registerEventSchemas",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "id",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "schema",
              "type": "string"
            },
            {
              "internalType": "bytes32",
              "name": "parentSchemaId",
              "type": "bytes32"
            }
          ],
          "internalType": "struct DataSchemaLibrary.SchemaRegistration[]",
          "name": "schemaRegistrations",
          "type": "tuple[]"
        }
      ],
      "name": "registerSchemas",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        },
        {
          "internalType": "enum RoleControl.Role",
          "name": "role",
          "type": "uint8"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        }
      ],
      "name": "schemaIdToId",
      "outputs": [
        {
          "internalType": "string",
          "name": "id",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        }
      ],
      "name": "schemaReverseLookup",
      "outputs": [
        {
          "internalType": "string",
          "name": "schema",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "bypass",
          "type": "bool"
        }
      ],
      "name": "setBypassRoleChecks",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum RoleControl.Role",
          "name": "role",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "isOpen",
          "type": "bool"
        }
      ],
      "name": "setIsRoleOpen",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "topic",
          "type": "bytes32"
        }
      ],
      "name": "topicRegistrationOrigin",
      "outputs": [
        {
          "internalType": "address",
          "name": "origin",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "publisher",
          "type": "address"
        }
      ],
      "name": "totalPublisherDataForSchema",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSchemasRegistered",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "topic",
          "type": "bytes32"
        }
      ],
      "name": "totalTopicIndexedParams",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "indexedParams",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as Abi
}
