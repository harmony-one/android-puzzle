package one.harmony.puzzle.ethereum;

import android.content.Context;
import android.util.Log;

import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.core.methods.response.Web3ClientVersion;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Numeric;

import java8.util.concurrent.CompletableFuture;
import one.harmony.puzzle.config.Constants;
import one.harmony.puzzle.ui.game.TransactionViewModel;
import one.harmony.puzzle.utils.Util;

public class NodeConnector {

    private static NodeConnector nodeConnector;
    private Web3j web3jNode;

    private Context mContext;

    private NodeConnector() {
        web3jNode = Web3j.build(new HttpService(Constants.INFURA_URL));
        Log.i(Util.LOG_TAG, "Web3j node object created.");

        //Code for checking whether connection has been established.
        CompletableFuture<Web3ClientVersion> web3clientCompletableFuture = web3jNode.web3ClientVersion().sendAsync();
        web3clientCompletableFuture.thenApply(web3ClientVersion -> {
            Log.i(Util.LOG_TAG, "Node Connection Established, Web Client Version: " + web3ClientVersion.getWeb3ClientVersion());
            return web3ClientVersion;
        });
    }

    public static void reCreateNodeConnector() {
        nodeConnector = new NodeConnector();
    }

    private void setContext(Context context) {
        mContext = context;
    }

    public static NodeConnector getInstance(Context context) {
        if (nodeConnector == null) {
            reCreateNodeConnector();
        } else {
            nodeConnector.setContext(context);
        }
        return nodeConnector;
    }

    //Call shutdown to free resource
    public void shutDown() {
        Log.i(Util.LOG_TAG, "Shutting down Etherum Node Connection");
        web3jNode.shutdown();
    }

    public CompletableFuture<EthGetTransactionCount> getNonceRequest(String address) {
        CompletableFuture<EthGetTransactionCount> nonceRequest;
        nonceRequest = web3jNode.ethGetTransactionCount(address, DefaultBlockParameterName.PENDING).sendAsync();
        return nonceRequest;
    }

    public void sendTransaction(byte[] signedTransaction) {
        String transactionToSend = Numeric.toHexString(signedTransaction);

        CompletableFuture<EthSendTransaction> transactionRequest = web3jNode.ethSendRawTransaction(transactionToSend).sendAsync();
        transactionRequest.thenApply(ethSendTransaction -> {
            if (ethSendTransaction.hasError()) {
                Log.e(Util.LOG_TAG, "Sending Transaction Failed with error code: " + ethSendTransaction.getError().getCode());
                Log.e(Util.LOG_TAG, "Sending Transaction Failed with error: " + ethSendTransaction.getError().getMessage());
            } else {
                Log.i(Util.LOG_TAG, "Hash: " + ethSendTransaction.getTransactionHash());
            }
            TransactionViewModel.setTransactionHash(ethSendTransaction.getTransactionHash());
            return signedTransaction;           //dummy return
        });
    }

}
