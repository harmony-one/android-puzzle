package one.harmony.puzzle.contract;

import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.DynamicArray;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 4.5.14.
 */
@SuppressWarnings("rawtypes")
public class Puzzle extends Contract {
    public static final String BINARY = "600580546001600160a01b031916331790556000600455600a60808181526101e06040529060a0610140803883395050815161004292600292506020019061007b565b5060408051600a8082526101608201909252906020820161014080388339505081516100759260039250602001906100e0565b50610168565b8280548282559060005260206000209081019282156100d0579160200282015b828111156100d057825182546001600160a01b0319166001600160a01b0390911617825560209092019160019091019061009b565b506100dc929150610127565b5090565b82805482825590600052602060002090810192821561011b579160200282015b8281111561011b578251825591602001919060010190610100565b506100dc92915061014e565b61014b91905b808211156100dc5780546001600160a01b031916815560010161012d565b90565b61014b91905b808211156100dc5760008155600101610154565b610981806101776000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063481c6a751461006757806352bcd7c81461008b578063817c89661461014857806388e814e614610180578063a551bb40146101d8578063ee5c4e5d14610273575b600080fd5b61006f61027b565b604080516001600160a01b039092168252519081900360200190f35b610146600480360360608110156100a157600080fd5b6001600160a01b03823516916020810135918101906060810160408201356401000000008111156100d157600080fd5b8201836020820111156100e357600080fd5b8035906020019184600183028401116401000000008311171561010557600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092955061028a945050505050565b005b61016e6004803603602081101561015e57600080fd5b50356001600160a01b031661059f565b60408051918252519081900360200190f35b610188610642565b60408051602080825283518183015283519192839290830191858101910280838360005b838110156101c45781810151838201526020016101ac565b505050509050019250505060405180910390f35b6101fe600480360360208110156101ee57600080fd5b50356001600160a01b03166106a5565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610238578181015183820152602001610220565b50505050905090810190601f1680156102655780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101886107d4565b6005546001600160a01b031681565b600554604080518082019091526013815272556e617574686f72697a65642041636365737360681b6020820152906001600160a01b0316331461034b5760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b838110156103105781810151838201526020016102f8565b50505050905090810190601f16801561033d5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b50604080518082019091526015815274139bdd0814995858da0813195d995b08131a5b5a5d605a1b6020820152600a83116103c75760405162461bcd60e51b81526020600482018181528351602484015283519092839260449091019190850190808383600083156103105781810151838201526020016102f8565b506001600160a01b03831660009081526020819052604090205482111561059a576001600160a01b0383166000908152602081815260408083208590556001825290912082516104199284019061088f565b5060045460005b60045481101561046c57846001600160a01b03166002828154811061044157fe5b6000918252602090912001546001600160a01b031614156104645780915061046c565b600101610420565b50600454811480156104805750600a600454105b1561048f576004805460010190555b6000811180156104d5575082600080600260018503815481106104ae57fe5b60009182526020808320909101546001600160a01b03168352820192909252604001902054105b1561055157600a81101561054857600260018203815481106104f357fe5b600091825260209091200154600280546001600160a01b03909216918390811061051957fe5b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b6000190161048f565b60045481101561059857836002828154811061056957fe5b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b505b505050565b600554604080518082019091526013815272556e617574686f72697a65642041636365737360681b60208201526000916001600160a01b031633146106255760405162461bcd60e51b81526020600482018181528351602484015283519092839260449091019190850190808383600083156103105781810151838201526020016102f8565b50506001600160a01b031660009081526020819052604090205490565b6060600280548060200260200160405190810160405280929190818152602001828054801561069a57602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831161067c575b505050505090505b90565b600554604080518082019091526013815272556e617574686f72697a65642041636365737360681b60208201526060916001600160a01b0316331461072b5760405162461bcd60e51b81526020600482018181528351602484015283519092839260449091019190850190808383600083156103105781810151838201526020016102f8565b506001600160a01b03821660009081526001602081815260409283902080548451600294821615610100026000190190911693909304601f81018390048302840183019094528383529192908301828280156107c85780601f1061079d576101008083540402835291602001916107c8565b820191906000526020600020905b8154815290600101906020018083116107ab57829003601f168201915b50505050509050919050565b606060005b600a81101561083957600080600283815481106107f257fe5b60009182526020808320909101546001600160a01b03168352820192909252604001902054600380548390811061082557fe5b6000918252602090912001556001016107d9565b50600380548060200260200160405190810160405280929190818152602001828054801561069a57602002820191906000526020600020905b815481526020019060010190808311610872575050505050905090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106108d057805160ff19168380011785556108fd565b828001600101855582156108fd579182015b828111156108fd5782518255916020019190600101906108e2565b5061090992915061090d565b5090565b6106a291905b80821115610909576000815560010161091356fea265627a7a7231582066d1477df044a3910470bc151ac95af284077cc02c2a8d3f4a6c7c699614198d64736f6c637827302e352e31362d6e696768746c792e323032302e312e322b636f6d6d69742e39633332323663650057";

    public static final String FUNC_GETLEVEL = "getLevel";

    public static final String FUNC_GETSEQUENCE = "getSequence";

    public static final String FUNC_GETTOPPLAYERS = "getTopPlayers";

    public static final String FUNC_GETTOPSCORES = "getTopScores";

    public static final String FUNC_MANAGER = "manager";

    public static final String FUNC_PAYOUT = "payout";

    @Deprecated
    protected Puzzle(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected Puzzle(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected Puzzle(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected Puzzle(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public RemoteFunctionCall<BigInteger> getLevel(String player) {
        final Function function = new Function(FUNC_GETLEVEL,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, player)),
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteFunctionCall<String> getSequence(String player) {
        final Function function = new Function(FUNC_GETSEQUENCE,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, player)),
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<List> getTopPlayers() {
        final Function function = new Function(FUNC_GETTOPPLAYERS,
                Arrays.<Type>asList(),
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Address>>() {}));
        return new RemoteFunctionCall<List>(function,
                new Callable<List>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List call() throws Exception {
                        List<Type> result = (List<Type>) executeCallSingleValueReturn(function, List.class);
                        return convertToNative(result);
                    }
                });
    }

    public RemoteFunctionCall<TransactionReceipt> getTopScores() {
        final Function function = new Function(
                FUNC_GETTOPSCORES,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<String> manager() {
        final Function function = new Function(FUNC_MANAGER,
                Arrays.<Type>asList(),
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<TransactionReceipt> payout(String player, BigInteger level, String sequence) {
        final Function function = new Function(
                FUNC_PAYOUT,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, player),
                        new org.web3j.abi.datatypes.generated.Uint256(level),
                        new org.web3j.abi.datatypes.Utf8String(sequence)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static Puzzle load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new Puzzle(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static Puzzle load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new Puzzle(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static Puzzle load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new Puzzle(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static Puzzle load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new Puzzle(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<Puzzle> deploy(Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider, BigInteger initialWeiValue) {
        return deployRemoteCall(Puzzle.class, web3j, credentials, contractGasProvider, BINARY, "", initialWeiValue);
    }

    public static RemoteCall<Puzzle> deploy(Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider, BigInteger initialWeiValue) {
        return deployRemoteCall(Puzzle.class, web3j, transactionManager, contractGasProvider, BINARY, "", initialWeiValue);
    }

    @Deprecated
    public static RemoteCall<Puzzle> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit, BigInteger initialWeiValue) {
        return deployRemoteCall(Puzzle.class, web3j, credentials, gasPrice, gasLimit, BINARY, "", initialWeiValue);
    }

    @Deprecated
    public static RemoteCall<Puzzle> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit, BigInteger initialWeiValue) {
        return deployRemoteCall(Puzzle.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, "", initialWeiValue);
    }
}
