package one.harmony.puzzle.ui.game;

import androidx.databinding.BaseObservable;
import androidx.databinding.Bindable;

import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;

import one.harmony.puzzle.config.Constants;


public class TransactionModel extends BaseObservable {

    private BigInteger nonce;
    private BigInteger gasPrice;
    private BigInteger gasLimit;
    private String toAddress;
    private BigInteger amount;
    private byte[] unsignedTransaction;
    private byte[] signedTransaction;
    private boolean signed;
    private String transactionHash;
    private RawTransaction rawTransaction;

    public byte[] generateUnsignedTransaction() {
        //Encoding Raw transaction to byte[] as per communication protocol set by SBK
        RawTransaction unsignedTransaction = RawTransaction.createEtherTransaction(nonce, gasPrice, gasLimit, toAddress, amount);

        setUnsignedRawTransaction(unsignedTransaction);

        return TransactionEncoder.encode(unsignedTransaction);
    }

    public byte[] generateUnsignedPayoutTransaction(String player, BigInteger level, String sequence) {
        Function function = new Function(
                "payout",
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, player),
                        new org.web3j.abi.datatypes.generated.Uint256(level),
                        new org.web3j.abi.datatypes.Utf8String(sequence)),
                Collections.<TypeReference<?>>emptyList());
        String txData = FunctionEncoder.encode(function);

        RawTransaction unsignedTransaction  = RawTransaction.createTransaction(
                nonce,
                gasPrice,
                gasLimit,
                Constants.PUZZLE_CONTRACT,
                txData);

        setUnsignedRawTransaction(unsignedTransaction);

        return TransactionEncoder.encode(unsignedTransaction);
    }

    private void setUnsignedRawTransaction(RawTransaction rawTrx) {
        rawTransaction = rawTrx;
    }
    public RawTransaction getUnsignedRawTransaction() {
        return rawTransaction;
    }

    public void setNonce(BigInteger nonce) {
        this.nonce = nonce;
    }

    public void setGasPrice(BigInteger gasPrice) {
        this.gasPrice = gasPrice;
    }

    public void setGasLimit(BigInteger gasLimit) {
        this.gasLimit = gasLimit;
    }

    public void setToAddress(String toAddress) {
        this.toAddress = toAddress;
    }

    public void setAmount(BigInteger amount) {
        this.amount = amount;
    }

    public byte[] getUnsignedTransaction() {
        return unsignedTransaction;
    }

    public void setUnsignedTransaction(byte[] unsignedTransaction) {
        this.unsignedTransaction = unsignedTransaction;
    }

    public byte[] getSignedTransaction() {
        return signedTransaction;
    }

    public void setSignedTransaction(byte[] signedTransaction) {
        this.signedTransaction = signedTransaction;
    }

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }

    @Bindable
    public boolean isSigned() {
        return signed;
    }

    public void setSigned(boolean signed) {
        this.signed = signed;
        //notifyPropertyChanged(BR.signed);
    }
}
