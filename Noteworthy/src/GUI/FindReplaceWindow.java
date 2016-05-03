package GUI;

import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.text.BadLocationException;
import javax.swing.text.DefaultHighlighter;

import MAIN.NoteArea;

/**
 * Copyright (C) 2016  Adeola Uthman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.*/
public class FindReplaceWindow extends JFrame {
	private static final long serialVersionUID = 496143735014291910L;

	//Labels and text fields for finding and replacing
	JLabel findLabel = new JLabel(" Find: ");
    JTextField findTF = new JTextField();
    JLabel replaceLabel = new JLabel(" Replace: ");
    JTextField replaceTF = new JTextField();
    
    //Buttons that carry out the actions
    JButton find = new JButton("Find");
    JButton replace = new JButton("Replace");
    JButton replaceAll = new JButton("Replace All");
    
    //Text area for getting information
    NoteArea textarea;
    
  
    
    
    public FindReplaceWindow(String title, NoteArea noteArea) {
        super(title);
        setSize(400,130);
        setLocationRelativeTo(null);
        setResizable(false);
        
        textarea = (NoteArea)noteArea;
        
        JPanel north = new JPanel(new GridLayout(2,2,10,10));
            north.add(findLabel);
            north.add(findTF);
            north.add(replaceLabel);
            north.add(replaceTF);
            
        
        JPanel south = new JPanel(new GridLayout(1,3,10,10));
            south.add(find);
            south.add(replace);
            south.add(replaceAll);
        
        Container pane = getContentPane();
        pane.add(north, BorderLayout.NORTH);
        pane.add(south, BorderLayout.SOUTH);
        
        find.addActionListener(new frActions());
        replace.addActionListener(new frActions());
        replaceAll.addActionListener(new frActions());
    }
    
    public void highlightText() {
    	for(int i = 0; i < textarea.getText().length() - findTF.getText().length() + 1; i++) {
        	//If you find the word, try highlighting it.
            if(textarea.getText().substring(i,i+findTF.getText().length()).equals(findTF.getText())) {
                try {
                	textarea.getHighlighter().addHighlight(i, i+findTF.getText().length(), DefaultHighlighter.DefaultPainter);
                	textarea.hasHighlights = true;
                } catch(Exception err) {
                    System.err.println("String was not found");
                }  
            }
        }
    }
    
    public class frActions implements ActionListener {

        @Override
        public void actionPerformed(ActionEvent e) {
            //Find
            if(e.getSource() == find) {
                //If it's not the empty string
                if(!findTF.getText().equals("")) {
	                highlightText();
                }
                
            }
            
            //Replace
            if(e.getSource() == replace) {
            	//Loop through for each appearance of the find text field.
            	for(int i = 0; i < textarea.getText().length(); i++) {
            		try {
						if(textarea.getText(i, findTF.getText().length()).equals(findTF.getText())) {
							textarea.getStyledDocument().remove(i, findTF.getText().length());
							textarea.getStyledDocument().insertString(i, replaceTF.getText(), textarea.sas);
							break;
						}
					} catch (BadLocationException e1) {
						e1.printStackTrace();
					}
            	}
            }
            
            //Replace all
            if(e.getSource() == replaceAll) {
            	//Loop through for each appearance of the find text field.
            	for(int i = 0; i < textarea.getText().length(); i++) {
            		try {
						if(textarea.getText(i, findTF.getText().length()).equals(findTF.getText())) {
							textarea.getStyledDocument().remove(i, findTF.getText().length());
							textarea.getStyledDocument().insertString(i, replaceTF.getText(), textarea.sas);
						}
					} catch (BadLocationException e1) {
						e1.printStackTrace();
					}
            	}
            }
        }
        
    }
    
}
