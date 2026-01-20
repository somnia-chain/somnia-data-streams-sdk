import { Abi } from "viem"

export async function StreamsABI(): Promise<Abi> {
    return [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        }
      ],
      "name": "AddressEmptyCode",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "implementation",
          "type": "address"
        }
      ],
      "name": "ERC1967InvalidImplementation",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ERC1967NonPayable",
      "type": "error"
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
      "name": "FailedCall",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "IncorrectNumberOfTopics",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidDataLength",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidIndex",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidInitialization",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidRange",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSelfReference",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSize",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidTopic",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "MaxArrayLengthExceeded",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NameAlreadyUsed",
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
      "inputs": [],
      "name": "NotInitializing",
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
      "name": "UUPSUnauthorizedCallContext",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "slot",
          "type": "bytes32"
        }
      ],
      "name": "UUPSUnsupportedProxiableUUID",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Unauthorized",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ZeroValue",
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
        }
      ],
      "name": "DataSchemaRegistered",
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
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "dataId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "publisher",
          "type": "address"
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
      "name": "EventSchemaRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "version",
          "type": "uint64"
        }
      ],
      "name": "Initialized",
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
          "internalType": "bool",
          "name": "isOpen",
          "type": "bool"
        }
      ],
      "name": "IsEventEmissionOpen",
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
          "indexed": true,
          "internalType": "address",
          "name": "implementation",
          "type": "address"
        }
      ],
      "name": "Upgraded",
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
      "name": "UPGRADE_INTERFACE_VERSION",
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
          "internalType": "struct IEventSource.EventData[]",
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
          "internalType": "struct IDataSchemaLibrary.DataStream[]",
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
              "internalType": "struct IEventSource.Parameter[]",
              "name": "params",
              "type": "tuple[]"
            },
            {
              "internalType": "bytes32",
              "name": "eventTopic",
              "type": "bytes32"
            }
          ],
          "internalType": "struct IEventSource.EventSchema[]",
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
          "name": "n",
          "type": "uint256"
        }
      ],
      "name": "getLastNPublishedDataForSchema",
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
      "name": "getLastPublishedDataForSchema",
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
          "name": "start",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "end",
          "type": "uint256"
        }
      ],
      "name": "getPublisherDataForSchemaInRange",
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
          "name": "initialOwner",
          "type": "address"
        }
      ],
      "name": "initialize",
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
          "internalType": "bytes32",
          "name": "topic",
          "type": "bytes32"
        }
      ],
      "name": "isEventEmissionOpen",
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
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "nameToSchemaId",
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
      "inputs": [],
      "name": "proxiableUUID",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
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
          "internalType": "struct IDataSchemaLibrary.DataStream[]",
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
          "internalType": "struct IEventSource.EventData[]",
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
      "name": "publisherDataExists",
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
          "name": "indexPlusOne",
          "type": "uint256"
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
              "internalType": "string",
              "name": "id",
              "type": "string"
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
                  "internalType": "struct IEventSource.Parameter[]",
                  "name": "params",
                  "type": "tuple[]"
                },
                {
                  "internalType": "bytes32",
                  "name": "eventTopic",
                  "type": "bytes32"
                }
              ],
              "internalType": "struct IEventSource.EventSchema",
              "name": "schema",
              "type": "tuple"
            }
          ],
          "internalType": "struct IEventSource.EventSchemaRegistration[]",
          "name": "registrations",
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
              "name": "schemaName",
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
          "internalType": "struct IDataSchemaLibrary.SchemaRegistration[]",
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
          "internalType": "bytes32",
          "name": "schemaId",
          "type": "bytes32"
        }
      ],
      "name": "schemaIdToName",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
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
          "internalType": "string",
          "name": "id",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isOpen",
          "type": "bool"
        }
      ],
      "name": "setIsEventEmissionOpen",
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
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "upgradeToAndCall",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ] as Abi
}
