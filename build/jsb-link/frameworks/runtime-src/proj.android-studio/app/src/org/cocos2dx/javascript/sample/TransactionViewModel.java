package org.cocos2dx.javascript.sample;

import android.content.Context;
import android.util.Log;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.Util;
import org.web3j.utils.Convert;

import java.math.BigInteger;


public class TransactionViewModel {

    private static BigInteger mGasLimit = new BigInteger("21000");
    private static TransactionModel currentTransaction;

    public static void sendTransaction(Context context) {
        NodeConnector.getInstance(context).sendTransaction(context, currentTransaction.getSignedTransaction());
    }

    public static void createAndSignTransaction(AppActivity context, String toAddress, String amount, String transactionSpeed) {
        //To ensure object has been created before it has been accessed
        currentTransaction = new TransactionModel();
        BigInteger amountValue = Convert.toWei(amount, Convert.Unit.ETHER).toBigInteger();
        currentTransaction.setGasPrice(getGasPrice(transactionSpeed));
        currentTransaction.setGasLimit(mGasLimit);
        currentTransaction.setAmount(amountValue);
        currentTransaction.setSigned(false);
        currentTransaction.setToAddress(toAddress);
        Log.i(Util.LOG_TAG, "Transaction Prepared without Nonce");

        NodeConnector.getInstance(context).getNonceRequest(context.publicKey).thenApply(ethGetTransactionCount -> {
            //After Fetching nonce
            BigInteger nonce = ethGetTransactionCount.getTransactionCount();
            currentTransaction.setNonce(nonce);

            Log.i(Util.LOG_TAG, "Nonce has been fetched, value: " + nonce);

            currentTransaction.setUnsignedTransaction(currentTransaction.generateUnsignedTransaction());
            Log.i(Util.LOG_TAG, "Unsigned Transaction has been created");

            //Sign Transaction with Samsung SBK
            context.signTransaction(currentTransaction.getUnsignedTransaction());

            return null;
        });
    }

    public static void setSignedTransaction(byte[] signedTransaction) {
        Log.i(Util.LOG_TAG,"Transaction Signed Successfully");
        currentTransaction.setSignedTransaction(signedTransaction);
        //After signing transaction is ready for sending
        currentTransaction.setSigned(true);
        //AlertUtil.showTransactionSigningSuccessful();
    }

    public static void setTransactionHash(String transactionHash) {
        currentTransaction.setTransactionHash(transactionHash);
        //After sending transaction invalidate it since same transaction should not be sent multiple times
        currentTransaction.setSigned(false);
        //AlertUtil.showTransactionSendingAlert(transactionHash);
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
