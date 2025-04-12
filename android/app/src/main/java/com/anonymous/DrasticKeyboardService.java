package com.drastickeyboard;

import android.inputmethodservice.InputMethodService;
import android.view.View;
import android.widget.LinearLayout;
import android.content.Context;

public class YourKeyboardService extends InputMethodService {
    @Override
    public View onCreateInputView() {
        // Replace with your keyboard view or layout
        LinearLayout inputView = new LinearLayout(this);
        inputView.setBackgroundColor(0xFF000000); // Black background
        return inputView;
    }
}
