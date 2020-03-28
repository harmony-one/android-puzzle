package org.cocos2dx.javascript.service;

public final class Entry  implements Comparable{
    public String key;
    public int score;

    public Entry(String key, int score) {
        this.key = key;
        this.score = score;
    }

    @Override
    public int compareTo(Object compareTo) {
        int scoreToCompare = ((Entry)compareTo).score;

        return scoreToCompare - this.score; // big first
    }
}
