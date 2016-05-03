package GUI;

import java.awt.BorderLayout;
import java.awt.GridLayout;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

/**Copyright (C) 2016  Adeola Uthman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.*/
public class WordcountWindow extends JFrame {
	private static final long serialVersionUID = -8320427500013217560L;

	
	GUIWindow guiwindow;
	
	
	JLabel withoutSpaces = new JLabel("		Word Count: ");
	JLabel characterCount = new JLabel("	Character Count (With Spaces): ");
	JLabel characterCountSpc = new JLabel("	Character Count (Without Spaces): ");
	
	
	
	
	public WordcountWindow(GUIWindow g) {
		super("Word Count");
		guiwindow = g;
		setSize(300,300);
		setLocationRelativeTo(null);
		
		setWithoutLabel();
		setCharCount();
		setCharCountSpc();
		
		JPanel center = new JPanel(new GridLayout(3,1,10,10));
			center.add(withoutSpaces);
			center.add(characterCount);
			center.add(characterCountSpc);
			
		getContentPane().add(center, BorderLayout.CENTER);
	}

	/** Sets the number of characters label (including spaces) */
	private void setCharCount() {
		int i = 0;
		String guitext = guiwindow.noteArea.getText();
		
		for(int j = 0; j < guitext.length(); j++) {
			
			if(!guitext.substring(j, j+1).equals("\n")) {
				i++;
			}
			
		}
		
		characterCount.setText("	Character Count (With Spaces): " + i);
	}
	
	/** Sets the number of characters label (excluding spaces) */
	private void setCharCountSpc() {
		int i = 0;
		String guitext = guiwindow.noteArea.getText();
		
		for(int j = 0; j < guitext.length(); j++) {
			
			if(!guitext.substring(j, j+1).equals("\n") && !guitext.substring(j, j+1).equals(" ")) {
				i++;
			}
			
		}
		
		characterCountSpc.setText("	Character Count (Without Spaces): " + i);
	}
	
	/** Find the number of words without spaces */
	private void setWithoutLabel() {
		
		//Split up the text by spaces
		String[] temp = guiwindow.noteArea.getText().split(" ");
		
		int words = 0;
		
		//Loop through to find what's actually a word
		for(String s : temp) {
			if(!s.equals("") && !s.equals(" ") && !s.equals("\n") && !s.equals("•"))
				words++;
		}
				
		withoutSpaces.setText("		Word Count: " + words);
	}

}
