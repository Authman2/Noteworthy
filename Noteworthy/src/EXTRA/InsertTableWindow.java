package EXTRA;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;

import MAIN.NoteArea;
import contents.ArrayConversion;


/** Responsible for creating tables.
 * Copyright (C) 2016  Adeola Uthman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details. */
public class InsertTableWindow extends JFrame {
	private static final long serialVersionUID = -7520043799623134238L;

	//Note area to insert to
	NoteArea notearea;
	
	//GUI elements
	JLabel infoLabel = new JLabel("	Enter the number of rows and columns.");
	JTextField rowsL = new JTextField("Rows:");
	JTextField columnsL = new JTextField("Columns:");
	JButton createTable = new JButton("Create Table");
	
	//Integers for each value
	int rows, columns;
	
	
	
	public InsertTableWindow(NoteArea na) {
		super("Insert Table");
		setSize(500,130);
		setLocationRelativeTo(null);
		
		notearea = na;
		
		
		JPanel north = new JPanel(new GridLayout(1,1,10,10));
			north.add(infoLabel);
		JPanel center = new JPanel(new GridLayout(2,1,10,10));
			center.add(rowsL);
			center.add(columnsL);
		JPanel south = new JPanel(new GridLayout(1,1,10,10));
			createTable.addActionListener(new ActionListener() {
				@Override
				public void actionPerformed(ActionEvent e) {
					//Create the table
					select();
				}
			});
			south.add(createTable);
			
		getContentPane().add(north, BorderLayout.NORTH);
		getContentPane().add(center, BorderLayout.CENTER);
		getContentPane().add(south, BorderLayout.SOUTH);
	}
	
	
	/* Trys to create the table based on the inputed values. */
	public void select() {
		try {
			//Set the rows and columns
			rows = Integer.parseInt(columnsL.getText());
			columns = Integer.parseInt(rowsL.getText());
			
			//Create an array of strings for the elements.
			String[] array = new String[rows*columns];
			
			//Loop through and call each element in the table "item" for now.
			for(int i = 0; i < array.length; i++) {
				array[i] = "item";
			}
			
			//Convert it to a 2D array at 'rows'.
			Object[][] table = ArrayConversion.OneToTwo(array, rows);
			
			//Create a string for the table, which will be inserted into the text pane.
			String insertion = "\n";
			
			//Loop through the 2D array and change the text to be inserted
			for(int i = 0; i < table.length; i++) {
				for(int j = 0; j < table[0].length; j++) {
					insertion += table[i][j] + "  ";
				}
				insertion += "\n";
			}
			
			//Lastly, try to insert the text into the text pane.
			try {
				notearea.getStyledDocument().insertString(notearea.getSelectionStart(), insertion, notearea.sas);
			} catch(Exception err) {
				System.err.println("There was a problem inserting the table.");
			}
			
			dispose();
			
		//If you put in anything other than a number, it will do this as an error.
		} catch(Exception err) {
			JOptionPane.showMessageDialog(this, "You must enter only integer values.");
		}
	}

}
