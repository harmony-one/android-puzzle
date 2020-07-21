package one.harmony.puzzle.ethereum;

import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.DynamicArray;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

import java.util.Arrays;
import java.util.List;

import io.reactivex.Observable;
import one.harmony.puzzle.config.Constants;
import one.harmony.puzzle.contract.Puzzle;

public class WalletService {

    private static final String TAG = WalletService.class.getSimpleName();

    private final Web3j web3j;

    public WalletService() {
        this.web3j = Web3j.build(new HttpService(Constants.INFURA_URL));
    }


    public Observable<List> getTopPlayers() {
        return Observable.create(emitter -> {
            Credentials credentials = Credentials.create("155FD0A535250B64B9DF7956FC542A24343176B009D21C8111AFCE6AB74A5F96");

            Puzzle puzzle = Puzzle.load(Constants.PUZZLE_CONTRACT, web3j, credentials, new DefaultGasProvider());

            try {
                List topPlayers = puzzle.getTopPlayers().send();
                emitter.onNext(topPlayers);
            } catch (Exception e) {
                emitter.onError(e);
            }
            emitter.onComplete();
        });
    }

    public Object getTopPlayers(String walletAddress) throws Exception {
        Function function = new Function("getTopPlayers",
                Arrays.<Type>asList(),
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Address>>() {}));

        String responseValue = callSmartContractFunction(function, walletAddress, Constants.PUZZLE_CONTRACT);

        List<Type> responseTopPlayers = FunctionReturnDecoder.decode(
                responseValue, function.getOutputParameters());
        if (responseTopPlayers != null && !responseTopPlayers.isEmpty()) {
            return responseTopPlayers.get(0).getValue();
        }

        return null;
    }


    private String callSmartContractFunction(org.web3j.abi.datatypes.Function function, String walletAddress, String contractAddress) throws Exception {
        String encodedFunction = FunctionEncoder.encode(function);

        org.web3j.protocol.core.methods.response.EthCall response = web3j.ethCall(
                Transaction.createEthCallTransaction(walletAddress, contractAddress, encodedFunction),
                DefaultBlockParameterName.LATEST)
                .sendAsync().get();

        return response.getValue();
    }
}
