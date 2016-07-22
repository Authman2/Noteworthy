package GUI;

import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.ScrollPaneConstants;

import MAIN.NoteArea;
import visualje.TextStyle;

/** Copyright (C) 2016  Adeola Uthman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.*/
public class FontsWindow extends JFrame {
	private static final long serialVersionUID = -5137305296724982575L;

	//The font that the user will choose.
	Font font;
	
	//Text area for getting information
	NoteArea textarea;
	
	//Labels for showing what each list does
	JLabel fontsLabel = new JLabel("Fonts:");
	JLabel styleLabel = new JLabel("Style:");
	JLabel sizeLabel = new JLabel("Size:");
	
	//Lists for choosing the font, style, and size
	JList<String> fontList = new JList<String>();
	JList<String> styleList = new JList<String>();
	Integer[] sizeList = {2,4,6,8,10,12,14,16,18,20,22,24,26,28,29,30,32,34,36,38,40,42,44,46,48,50};
	JComboBox<Integer> sizeBox = new JComboBox<Integer>(sizeList);
	
	//Button for actually changing the font
	JButton selectButton = new JButton("Select");
	
	
	public FontsWindow(String title, NoteArea noteArea) {
		super(title);
		setSize(415,410);
        setLocationRelativeTo(null);
		
        textarea = noteArea;
        
        /* INITIAL SETUP */
        addFonts();
        sizeBox.setEditable(true);
        sizeBox.setSelectedIndex(7);
        fontList.setSelectedIndex(11);
        styleList.setSelectedIndex(0);
        
        /* PANEL SETUP */
        JPanel north = new JPanel(new GridLayout(1,4,10,10));
        	north.add(fontsLabel);
        	north.add(styleLabel);
        	north.add(sizeBox);
        	north.add(selectButton);
        JPanel west = new JPanel(new GridLayout(1,2,10,10));
        	JScrollPane scroller = new JScrollPane(fontList,ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS,ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
        	west.add(scroller);
        	west.add(styleList);
        
        Container pane = getContentPane();
        	pane.add(north, BorderLayout.NORTH);
        	pane.add(west, BorderLayout.WEST);
        	
		
        selectButton.addActionListener(new fActions());
	}

	private void addFonts() {
		styleList.setListData(new String[] {"Plain","Bold","Italic"});
		fontList.setListData(new String[] {new Font("Arial",0,15).getName(),
										 new Font("Calibri",0,15).getName(),
										 new Font("Avenir",0,15).getName(),
										 new Font("Avenir Next",0,15).getName(),
										 new Font("Bell MT",0,15).getName(),
										 new Font("Bradley Hand",0,15).getName(),
										 new Font("Britannic Bold",0,15).getName(),
										 new Font("Bush Script MT",0,15).getName(),
										 new Font("Chalkboard SE",0,15).getName(),
										 new Font("Chaparral Pro",0,15).getName(),
										 new Font("Cochin",0,15).getName(),
										 new Font("Comic Sans MS",0,15).getName(),
										 new Font("Constantia",0,15).getName(),
										 new Font("Courier",0,15).getName(),
										 new Font("Curiz MT",0,15).getName(),
										 new Font("Didot",0,15).getName(),
										 new Font("Garamond",0,15).getName(),
										 new Font("Gill Sans",0,15).getName(),
										 new Font("Garamond",0,15).getName(),
										 new Font("Goudy Old Style",0,15).getName(),
										 new Font("Hoefler Text",0,15).getName(),
										 new Font("Iowan Old Style",0,15).getName(),
										 new Font("Kozuka Gothic Pro",0,15).getName(),
										 new Font("Lithos Pro",0,15).getName(),
										 new Font("Lucida Calligraphy",0,15).getName(),
										 new Font("Lucida Handwriting",0,15).getName(),
										 new Font("Microsoft Himalaya",0,15).getName(),
										 new Font("Minion Pro",0,15).getName(),
										 new Font("Mistral",0,15).getName(),
										 new Font("Noteworthy",0,15).getName(),
										 new Font("Nueva Std",0,15).getName(),
										 new Font("Perpetua",0,15).getName(),
										 new Font("PMingLiU",0,15).getName(),
										 new Font("Savoye LET",0,15).getName(),
										 new Font("SignPainter",0,15).getName(),
										 new Font("Tahoma",0,15).getName(),
										 new Font("Tekton Pro",0,15).getName(),
										 new Font("Times",0,15).getName(),
										 new Font("Times New Roman",0,15).getName(),
										 new Font("Trajan Pro",0,15).getName(),
										 new Font("Trattatello",0,15).getName(),
										 new Font("Zapfino",0,15).getName(),
										 new Font("Monotype Corsiva",0,15).getName() });
	}


	
	//Change the font based on what is inputed in the fonts window
	public class fActions implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent e) {
			if(e.getSource() == selectButton) {
				if(styleList.getSelectedValue().toString().equals("Plain")) {
					font = new Font(fontList.getSelectedValue(),0,(Integer)sizeBox.getSelectedItem());
					
					int selectionLength = textarea.getText().substring(textarea.getSelectionStart(),textarea.getSelectionEnd()).length();

					TextStyle t = new TextStyle(textarea, textarea.getSelectionStart(), selectionLength, "PLAIN");
					t.setFont(font);
					t.addStyle();
				
					textarea.getGUIWindow().textstyles.add(t);
				}
					
				if(styleList.getSelectedValue().toString().equals("Bold")) {
					font = new Font(fontList.getSelectedValue(),1,(Integer)sizeBox.getSelectedItem());

					int selectionLength2 = textarea.getText().substring(textarea.getSelectionStart(),textarea.getSelectionEnd()).length();
				
					TextStyle t2 = new TextStyle(textarea, textarea.getSelectionStart(), selectionLength2, "BOLD");
					t2.setFont(font);
					t2.addStyle();
					
					textarea.getGUIWindow().textstyles.add(t2);
				}
					
				if(styleList.getSelectedValue().toString().equals("Italic")) {
					font = new Font(fontList.getSelectedValue(),2, (Integer)sizeBox.getSelectedItem());
				
					int selectionLength3 = textarea.getText().substring(textarea.getSelectionStart(),textarea.getSelectionEnd()).length();
					
					TextStyle t3 = new TextStyle(textarea, textarea.getSelectionStart(), selectionLength3, "ITALIC");
					t3.setFont(font);
					t3.addStyle();
					
					textarea.getGUIWindow().textstyles.add(t3);
				}
				
				
			}
		}
	}
	
}
