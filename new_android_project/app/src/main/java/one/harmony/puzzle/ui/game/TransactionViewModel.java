package one.harmony.puzzle.ui.game;

import android.content.Context;
import android.util.Log;

import com.samsung.android.sdk.coldwallet.ScwService;

import org.web3j.utils.Convert;

import java.math.BigInteger;

import one.harmony.puzzle.config.Constants;
import one.harmony.puzzle.ethereum.KeyStoreManager;
import one.harmony.puzzle.ethereum.NodeConnector;
import one.harmony.puzzle.utils.Util;


public class TransactionViewModel {

    private static BigInteger mGasLimit = new BigInteger("21000");
    private static TransactionModel currentTransaction;

    public static TransactionModel getCurrentTransaction() {
        if (currentTransaction == null) {
            currentTransaction = new TransactionModel();
        }
        return currentTransaction;
    }

    public static void sendTransaction(Context context) {
        NodeConnector.getInstance(context).sendTransaction(currentTransaction.getSignedTransaction());
    }

    public static void createAndSignTransaction(Context context, String publicKey, String player, BigInteger level, String sequence, String transactionSpeed, ScwService.ScwSignEthTransactionCallback callback) {
        //To ensure object has been created before it has been accessed
        getCurrentTransaction();
        currentTransaction.setGasPrice(getGasPrice(transactionSpeed));
        currentTransaction.setGasLimit(mGasLimit);
        currentTransaction.setSigned(false);
        currentTransaction.setToAddress(Constants.PUZZLE_CONTRACT);
        Log.i(Util.LOG_TAG, "Transaction Prepared without Nonce");

        NodeConnector.getInstance(context).getNonceRequest(publicKey).thenApply(ethGetTransactionCount -> {
            //After Fetching nonce
            currentTransaction.setNonce(ethGetTransactionCount.getTransactionCount());
            Log.i(Util.LOG_TAG, "Nonce has been fetched");
            currentTransaction.setUnsignedTransaction(currentTransaction.generateUnsignedPayoutTransaction(player, level, sequence));
            Log.i(Util.LOG_TAG, "Unsigned Transaction has been created");
            KeyStoreManager.getInstance(context).signTransaction(currentTransaction.getUnsignedTransaction(), callback);
            return null;
        });
    }

    public static void setSignedTransaction(byte[] signedTransaction) {
        Log.i(Util.LOG_TAG,"Transaction Signed Successfully");
        currentTransaction.setSignedTransaction(signedTransaction);
        //After signing transaction is ready for sending
        currentTransaction.setSigned(true);
    }

    public static void setTransactionHash(String transactionHash) {
        currentTransaction.setTransactionHash(transactionHash);
        //After sending transaction invalidate it since same transaction should not be sent multiple times
        currentTransaction.setSigned(false);
    }

    private static BigInteger getGasPrice(String transactionSpeed) {
        //Gas Price For Average
        BigInteger gasPrice = Convert.toWei("10", Convert.Unit.GWEI).toBigInteger();
        if (transactionSpeed.equals("slow")) {
            gasPrice = Convert.toWei("4", Convert.Unit.GWEI).toBigInteger();
        } else if (transactionSpeed.equals("fast")) {
            gasPrice = Convert.toWei("20", Convert.Unit.GWEI).toBigInteger();
        }
        return gasPrice;
    }


}
