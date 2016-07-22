package GUI;

import java.awt.Color;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.util.ArrayList;

import javax.swing.JButton;
import javax.swing.JColorChooser;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JMenuBar;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.ScrollPaneConstants;
import javax.swing.event.UndoableEditEvent;
import javax.swing.event.UndoableEditListener;
import javax.swing.text.DefaultHighlighter;
import javax.swing.text.Highlighter;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.undo.CannotRedoException;
import javax.swing.undo.UndoManager;

import EXTRA.MenuBar;
import FILE.ExtensionFilter;
import MAIN.NoteArea;
import filesje.Load;
import filesje.ReadFile;
import filesje.Save;
import visualje.TextStyle;

/**Copyright (C) 2016  Adeola Uthman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.*/
public class GUIWindow extends JPanel {
	private static final long serialVersionUID = 2054181992322087814L;
	
	//This JFrame
	public JPanel guiwindow;
	
	//The frame that holds this panel
	public JFrame holdingframe;
	
	//The menu bar
	public JMenuBar menubar = new JMenuBar();
	
	//Buttons for loading, saving, and making a new note
	JButton newNote = new JButton();
	JButton saveNote = new JButton();
	JButton saveAsNote = new JButton();
	JButton loadNote = new JButton();
	
	//Buttons for bolding, italicizing, and changing the font
	JButton boldIt = new JButton();
	JButton italicIt = new JButton();
	JButton underlineIt = new JButton();
	JButton strikethroughIt = new JButton();
	JButton changeFont = new JButton();
	
	//Button that opens up the find/replace window
	JButton findReplace = new JButton();
	
	//Text coloring button
	public JButton colorIt = new JButton();
	
	//Creating bulleted and numbered lists, and a number to track the numbered list
	JButton bulletedList = new JButton();
	JButton numberedList = new JButton();
	public int num = 1;
	
	//Undo/Redo Buttons
	JButton undoButton = new JButton();
	JButton redoButton = new JButton();
	
	//A text field and area for writing notes
	public JTextField titleField = new JTextField("Title");
	public NoteArea noteArea;
	
	//The file chooser
	public final JFileChooser fileChooser = new JFileChooser();
	
	//Undo manager
	public UndoManager undoManager = new UndoManager();
	
	//Simple Attribute Set
	SimpleAttributeSet sas;
	
	//Highlighter
	public Highlighter.HighlightPainter highlighter = new DefaultHighlighter.DefaultHighlightPainter(Color.yellow);
	
	//The menu bar setup
	MenuBar menu;
	
	//List of styles
	public ArrayList<TextStyle> textstyles = new ArrayList<TextStyle>();
	
	
	
	
	public GUIWindow(JFrame holdingFrame) {
		 //super(title);
		 noteArea = new NoteArea(this);
		 noteArea.setText("Note");
		 sas = new SimpleAttributeSet();
		 guiwindow = this;
		 
		 /* MENU SETUP */
		 holdingFrame.setJMenuBar(menubar);
		 menu = new MenuBar(this);
		 menu.setup();
		 
		 /* INITIAL SETUP */	 
		 Font defaultFont = new Font("Comic Sans MS", 0, 16);
		 titleField.setFont(defaultFont);
		 noteArea.setFont(defaultFont);

		 fileChooser.setAcceptAllFileFilterUsed(false);
		 fileChooser.setFileFilter(new ExtensionFilter("ntwy"));
		 fileChooser.addChoosableFileFilter(new ExtensionFilter("txt"));
		 
		 /* SET ACTION LISTENERS */
		 setActionListeners();
		 
		 /* PANEL AND BUTTON SETUP */
		 setupPanels();
	 }
	
	
	 /** Sets the action listener for each GUI element. */
	 private void setActionListeners() {
		noteArea.getDocument().addUndoableEditListener(new undolistener());
		newNote.addActionListener(new actions());
		saveNote.addActionListener(new actions());
		saveAsNote.addActionListener(new actions());
		loadNote.addActionListener(new actions());
		boldIt.addActionListener(new actions());
		italicIt.addActionListener(new actions());
		underlineIt.addActionListener(new actions());
		strikethroughIt.addActionListener(new actions());
		changeFont.addActionListener(new actions());
		findReplace.addActionListener(new actions());
		bulletedList.addActionListener(new actions());
		numberedList.addActionListener(new actions());
		undoButton.addActionListener(new actions());
		redoButton.addActionListener(new actions());
		colorIt.addActionListener(new actions());
	 }
	
	 /** Set the icons and the tool tips for each button. */
	 private void setupIconsAndTooltips() {
//		 newNote.setIcon(new ImageIcon(Assets.NEW_NOTE));
//	 	 saveNote.setIcon(new ImageIcon(Assets.SAVE_NOTE));
//	 	 loadNote.setIcon(new ImageIcon(Assets.OPEN_NOTE));
//	 	 saveAsNote.setIcon(new ImageIcon(Assets.SAVE_AS));
//	 	 boldIt.setIcon(new ImageIcon(Assets.BOLD));
//	 	 italicIt.setIcon(new ImageIcon(Assets.ITALIC));
//	 	 underlineIt.setIcon(new ImageIcon(Assets.UNDERLINE));
//	 	 strikethroughIt.setIcon(new ImageIcon(Assets.STRIKETHROUGH));
//	 	 changeFont.setIcon(new ImageIcon(Assets.FONTS));
//	 	 findReplace.setIcon(new ImageIcon(Assets.FINDREPLACE));
//	 	 colorIt.setIcon(new ImageIcon(Assets.COLOR));
//	 	 bulletedList.setIcon(new ImageIcon(Assets.BULLETED_LIST));
//	 	 numberedList.setIcon(new ImageIcon(Assets.NUMBERED_LIST));
//	 	 undoButton.setIcon(new ImageIcon(Assets.UNDO));
//	 	 redoButton.setIcon(new ImageIcon(Assets.REDO));
		 newNote.setText("New Note");
		 saveNote.setText("Save Note");
		 loadNote.setText("Load Note");
		 saveAsNote.setText("Save As");
		 boldIt.setText("Bold");
		 italicIt.setText("Italic");
		 underlineIt.setText("Underline");
		 strikethroughIt.setText("StrikeThrough");
		 changeFont.setText("Fonts");
		 findReplace.setText("Find/Replace");
		 colorIt.setText("Color");
		 bulletedList.setText("Bulleted List");
		 numberedList.setText("Numbered List");
		 undoButton.setText("Undo");
		 redoButton.setText("Redo");
	 	 
	 	 newNote.setToolTipText("Create a new note");
	 	 saveNote.setToolTipText("Save this note");
	 	 loadNote.setToolTipText("Open a saved note");
	 	 saveAsNote.setToolTipText("Save As");
	 	 boldIt.setToolTipText("Bold");
	 	 italicIt.setToolTipText("Italic");
	 	 underlineIt.setToolTipText("Underline");
	 	 strikethroughIt.setToolTipText("Strikethrough");
	 	 changeFont.setToolTipText("Change the font");
	 	 findReplace.setToolTipText("Find/Replace");
	 	 colorIt.setToolTipText("Color the text");
	 	 bulletedList.setToolTipText("A new bulleted list");
	 	 numberedList.setToolTipText("A new numbered list");
	 	 undoButton.setToolTipText("Undo");
	 	 redoButton.setToolTipText("Redo");
	 }
	 
	/** Add all of the components to the appropriate panels. */
	 private void setupPanels() {
		 JButton[] buttons = {newNote,saveNote,loadNote,saveAsNote,boldIt,italicIt,underlineIt,strikethroughIt,
				 			changeFont,findReplace,colorIt,bulletedList,numberedList,undoButton,redoButton};
		 
		 for(JButton button : buttons) {
			 button.setContentAreaFilled(false);
			 //button.setBorderPainted(false);
			 button.setOpaque(false);
			 button.setBackground(Color.WHITE);
		 }
		 
		 JPanel north = new JPanel();
		 	north.setBounds(5, 5, 550, 105);
		 	setupIconsAndTooltips();
		 	north.add(newNote);
		 	north.add(saveNote);
		 	north.add(loadNote);
		 	north.add(saveAsNote);
		 	north.add(boldIt);
		 	north.add(italicIt);
		 	north.add(underlineIt);
		 	north.add(strikethroughIt);
		 	north.add(changeFont);
		 	north.add(findReplace);
		 	north.add(colorIt);
		 	north.add(bulletedList);
		 	north.add(numberedList);
		 	north.add(undoButton);
		 	north.add(redoButton);
		
		 this.add(north);
		 	
		 titleField.setBounds(5, 125, 530, 28);
		 this.add(titleField);
		 titleField.setColumns(10);
		 	
		 noteArea.setBounds(5, 160, 530, 315);
		 JScrollPane scrollPane = new JScrollPane(noteArea, ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED, ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
		 JPanel notePanel = new JPanel(new GridLayout(1,1,1,1));
		 	notePanel.setBounds(5, 160, 530, 315);
		 	notePanel.add(scrollPane);
		 this.add(notePanel);
	 }
	
	 
	 /** Loads only the text from a note. */
	 public File loadNoteText() {
		 //The file to grab.
		 File file = fileChooser.getSelectedFile();
		
		 //Using my "ReadFile" class.
		 ReadFile reader = new ReadFile();
		 String loadedNote = "";
		
		 //Try loading the file's text
		 try { loadedNote = reader.read(file.getPath()); } catch (Exception e1) { e1.printStackTrace(); }
        
		 //Set the texts
		 if(file.getName().endsWith(".ntwy"))
			titleField.setText(file.getName().substring(0, file.getName().length()-5));
		 else
			 titleField.setText(file.getName().substring(0, file.getName().length()-4));
		 noteArea.setText(loadedNote.substring(7));
		 
		 
		 return file;
	 }
	 
	 
	 /** All the actions that can be performed through clicking the buttons. */
	 public class actions implements ActionListener {
		 
		 @SuppressWarnings("unchecked")
		@Override
		 public void actionPerformed(ActionEvent e) {
			 
			 //Make a new note
			 if(e.getSource() == newNote) {
				 titleField.setText("Title");
				 noteArea.setText("Note");
				 TextStyle t = new TextStyle(noteArea, 0, noteArea.getText().length(), "PLAIN");
				 t.setFont(new Font("Comic Sans MS", 0, 16));
				 t.addStyle();
			 }
			 
			 //Save the note as an object
			 if(e.getSource() == saveNote) {
				 Save saver = new Save();
				 
				 saver.SaveFile(textstyles, titleField.getText() + "_styles");
				 saver.SaveFile(noteArea.getText(), titleField.getText() + ".ntwy");
			 }
			 
			 //Load a saved note
			 if(e.getSource() == loadNote) {
				 int val = fileChooser.showOpenDialog(guiwindow);
					
				 if(val == JFileChooser.APPROVE_OPTION) {
					 //Load the text in the note
					 File f = loadNoteText();
					 
					 //Load all of the styling attributes
					 Load loader = new Load();
					 textstyles = (ArrayList<TextStyle>) loader.LoadFile(textstyles, fileChooser.getCurrentDirectory().getAbsolutePath() + "/" + f.getName().substring(0, f.getName().length()-5) + "_styles");
					 
					 //Set the style attributes again
					 for(TextStyle ts : textstyles) {
						 ts.setTextPane(noteArea);
						 ts.addStyle();
					 }
					 
				 }
			 }
			 
			 //Change the text to bold
			 if(e.getSource() == boldIt) {
				 int selectionLength = noteArea.getText().substring(noteArea.getSelectionStart(),noteArea.getSelectionEnd()).length();

				 TextStyle t = new TextStyle(noteArea, noteArea.getSelectionStart(), selectionLength, "BOLD");
				 t.addStyle();
				 textstyles.add(t);
			 }
			 
			 //Change to italics
			 if(e.getSource() == italicIt) {
				 int selectionLength = noteArea.getText().substring(noteArea.getSelectionStart(),noteArea.getSelectionEnd()).length();

				 TextStyle t = new TextStyle(noteArea, noteArea.getSelectionStart(), selectionLength, "ITALIC");
				 t.addStyle();
				 textstyles.add(t);
			 }
			 
			 //Change to underline
			 if(e.getSource() == underlineIt) {
				 int selectionLength = noteArea.getText().substring(noteArea.getSelectionStart(),noteArea.getSelectionEnd()).length();

				 TextStyle t = new TextStyle(noteArea, noteArea.getSelectionStart(), selectionLength, "UNDERLINE");
				 t.addStyle();
				 textstyles.add(t);
			 }
			 
			 //Strikethrough
			 if(e.getSource() == strikethroughIt) {
				 int selectionLength = noteArea.getText().substring(noteArea.getSelectionStart(),noteArea.getSelectionEnd()).length();

				 TextStyle t = new TextStyle(noteArea, noteArea.getSelectionStart(), selectionLength, "STRIKETHROUGH");
				 t.addStyle();
				 textstyles.add(t);
			 }
			 
			 //Change fonts
			 if(e.getSource() == changeFont) {
				 FontsWindow fw = new FontsWindow("Fonts", noteArea);
				 fw.setVisible(true);
			 }
			 
			 //Bulleted list
			 if(e.getSource() == bulletedList) {
				 try {
				 	noteArea.getDocument().insertString(noteArea.getSelectionStart(), "\n • \n", sas);
				 } catch(Exception err) {
					 err.printStackTrace();
				 }
			 }
			 
			 //Numbered list
			 if(e.getSource() == numberedList) {
				 try {
				 	noteArea.getDocument().insertString(noteArea.getSelectionStart(), "\n " + num + ".) \n", sas);
				 } catch(Exception err) {
					 err.printStackTrace();
				 }
				 num++;
			 }
			 
			 //Find/Replace
			 if(e.getSource() == findReplace) {
				 FindReplaceWindow frw = new FindReplaceWindow("Find/Replace",noteArea);
				 frw.setVisible(true);
			 }
			 
			 //Undo
			 if(e.getSource() == undoButton) {
				 try {
			 		undoManager.undo();
				 } catch (Exception err) {
					 System.err.println("Nothing to undo!");
				 }
			 }
			 
			 //Redo
			 if(e.getSource() == redoButton) {
				 try {
					undoManager.redo();
				 } catch (CannotRedoException err) {
					 System.err.println("Nothing to redo!");
				 }
			 }
			 
			 //Color
			 if(e.getSource() == colorIt) {
				 int selectionLength = noteArea.getText().substring(noteArea.getSelectionStart(),noteArea.getSelectionEnd()).length();

				 Color c = JColorChooser.showDialog(null, "Pick a color", getForeground());
			     
				 if(c != null) {
					 TextStyle coloring = new TextStyle(noteArea, noteArea.getSelectionStart(), selectionLength);
				     coloring.setTextColor(c);
				     coloring.addColorStyle();
				     
				     textstyles.add(coloring);
				 }
			 }
			 
		 } //End of method
	 } //End of action listener class

	 
	 /** Handles the undo feature. */
	 public class undolistener implements UndoableEditListener {
		@Override
		public void undoableEditHappened(UndoableEditEvent e) {
			undoManager.addEdit(e.getEdit());
		}
	 }
	 
	 
	 
}