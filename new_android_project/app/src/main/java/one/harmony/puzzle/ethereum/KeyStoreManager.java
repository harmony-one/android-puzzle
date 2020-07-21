package one.harmony.puzzle.ethereum;

import android.content.Context;
import android.util.Log;

import com.samsung.android.sdk.coldwallet.ScwCoinType;
import com.samsung.android.sdk.coldwallet.ScwService;

import one.harmony.puzzle.utils.Util;

public class KeyStoreManager {

    private static KeyStoreManager keyStoreManagerInstance;
    private ScwService mScwService;
    private ScwService.ScwSignEthTransactionCallback mScwSignEthTransactionCallback;

    private KeyStoreManager(Context context) {
        mScwService = ScwService.getInstance();
    }

    public static KeyStoreManager getInstance(Context context) {
        if (keyStoreManagerInstance == null) {
            keyStoreManagerInstance = new KeyStoreManager(context);
        }
        return keyStoreManagerInstance;
    }

    public boolean isSBKSupported() {
        mScwService = ScwService.getInstance();
        if (mScwService == null) {
            Log.e(Util.LOG_TAG, "SBK is Not Supported on Device");
            return false;
        } else {
            return true;
        }
    }

    public String getSeedHashFromSBK() {
        if (isSBKSupported()) {
            return mScwService.getSeedHash();
        } else {
            return "SBK not supported";
        }
    }

    public boolean isSBKWalletSet() {
        if (isSBKSupported()) {
            int hashLength = getSeedHashFromSBK().length();
            if (hashLength == 0) {
                return false;
            } else {
                return true;
            }
        } else return false;
    }

    public Integer getKeystoreApiLevel() {
        if (isSBKSupported()) {
            return mScwService.getKeystoreApiLevel();
        } else return -1;       //dummy return
    }

    public void getPublicAddress(String hdPath, ScwService.ScwGetAddressListCallback scwGetAddressListCallback) {
        Log.i(Util.LOG_TAG, "Init SBK to read address with " + hdPath);
        if (isSBKSupported()) {
            mScwService.getAddressList(scwGetAddressListCallback, Util.stringToArrayList(hdPath));
        }
    }

    public void signTransaction(byte[] unsignedTransaction, ScwService.ScwSignEthTransactionCallback callback) {
        Log.i(Util.LOG_TAG, "Init SBK to sign transaction");
        if (isSBKSupported()) {
            String ethereumHdPath = ScwService.getHdPath(ScwCoinType.ETH, 0);
            mScwService.signEthTransaction(callback, unsignedTransaction, ethereumHdPath);
        }
    }
}
