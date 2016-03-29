package GUI;

import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLayeredPane;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ScrollPaneConstants;

import contents.Save;

public class GUIWindow extends JFrame {

	private static final long serialVersionUID = 2054181992322087814L;
	
	JMenuBar menubar = new JMenuBar();
	
	JButton newNote = new JButton("New Note");
	JButton saveNote = new JButton("Save Note");
	JButton loadNote = new JButton("Load Note");
	
	JButton boldIt = new JButton("Bold");
	JButton italicIt = new JButton("Italic");
	JButton changeFont = new JButton("Fonts");
	
	JButton findReplace = new JButton("Find/Replace");
	
	JButton bulletedList = new JButton("•--- •---");
	JButton numberedList = new JButton("1.) --- 2.) ---");
	int num = 1;
	
	JTextField titleField = new JTextField("Title");
	JTextArea noteArea = new JTextArea("Note");

	 
	 public GUIWindow(String title) {
		 super(title);
		 
		 /* MENU SETUP */
		 setJMenuBar(menubar);
		 setupMenuBar();
		 
		 /* INITIAL SETUP */	 
		 titleField.setFont(new Font("Comic Sans MS",0,15));
		 noteArea.setFont(new Font("Comic Sans MS",0,15));
		 noteArea.setLineWrap(true);
		 noteArea.setWrapStyleWord(true);
		 
		 /* SET ACTION LISTENERS */
		 setActionListeners();
		 
		 /* PANEL AND BUTTON SETUP */
		 Container pane = getContentPane();
		 JLayeredPane layeredPane = new JLayeredPane();
		 pane.add(layeredPane, BorderLayout.CENTER);
		 setupPanels(layeredPane);
	 }

	 /** Sets the action listener for each GUI element. */
	 private void setActionListeners() {
		newNote.addActionListener(new actions());
		saveNote.addActionListener(new actions());
		loadNote.addActionListener(new actions());
		boldIt.addActionListener(new actions());
		italicIt.addActionListener(new actions());
		changeFont.addActionListener(new actions());
		findReplace.addActionListener(new actions());
		bulletedList.addActionListener(new actions());
		numberedList.addActionListener(new actions());
	 }

	/** Add all of the components to the appropriate panels. */
	 private void setupPanels(JLayeredPane layeredPane) {
		//Buttons panel
		 JPanel buttonsPanel = new JPanel();
		 	buttonsPanel.setBounds(5, 5, 630, 100);
		 	buttonsPanel.setLayout(new GridLayout(3,4,10,10));
		 	buttonsPanel.add(newNote);
		 	buttonsPanel.add(saveNote);
		 	buttonsPanel.add(loadNote);
		 	buttonsPanel.add(boldIt);
		 	buttonsPanel.add(italicIt);
		 	buttonsPanel.add(changeFont);
		 	buttonsPanel.add(bulletedList);
		 	buttonsPanel.add(numberedList);
		 	buttonsPanel.add(findReplace);
		 layeredPane.add(buttonsPanel);
		 
		 //title field panel
		 JPanel titlefieldPanel = new JPanel();
			 titlefieldPanel.setBounds(5,110,630,30);
			 titlefieldPanel.setLayout(new GridLayout(1,1,10,10));
			 titlefieldPanel.add(titleField);
		 layeredPane.add(titlefieldPanel);
		 
		 //Note are panel
		 JScrollPane scrollPane = new JScrollPane(noteArea,ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED,ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
		 JPanel notePanel = new JPanel();
		 	notePanel.setBounds(10, 145, 620, 380);
		 	notePanel.setLayout(new GridLayout(1,1,10,10));
		 	notePanel.add(scrollPane);
		 layeredPane.add(notePanel);
	}

	 /** Add the necessary elements to the menu bar. */
	 private void setupMenuBar() {
		 JMenu file = new JMenu("File");
		 	JMenuItem NEWNOTE = new JMenuItem("New Note");
		 	JMenuItem OPENNOTE = new JMenuItem("Open Note");
		 	JMenuItem SAVENOTE = new JMenuItem("Save Note");
		 	JMenuItem QUIT = new JMenuItem("Quit");
		 	file.add(NEWNOTE);
		 	file.add(OPENNOTE);
		 	file.add(SAVENOTE);
		 	file.add(QUIT);
		 JMenu edit = new JMenu("Edit");
		 	JMenuItem UNDO = new JMenuItem("Undo");
		 	JMenuItem FIND = new JMenuItem("Find");
		 	JMenuItem REPLACE = new JMenuItem("Replace");
		 	edit.add(UNDO);
		 	edit.add(FIND);
		 	edit.add(REPLACE);
		 JMenu window = new JMenu("Window");
		 	JMenuItem MINIMIZE = new JMenuItem("Minimize");
		 	JMenuItem MAXIMIZE = new JMenuItem("Maximize");
		 	window.add(MINIMIZE);
		 	window.add(MAXIMIZE);
		 JMenu help = new JMenu("Help");
		 	JMenuItem ABOUT = new JMenuItem("About");
		 	help.add(ABOUT);
		 	
		 menubar.add(file);
		 menubar.add(edit);
		 menubar.add(window);
		 menubar.add(help);
	}
	 
	 
	 
	 
	 
	 /** All the actions that can be performed through clicking the buttons. */
	 public class actions implements ActionListener {
		 
		 @Override
		 public void actionPerformed(ActionEvent e) {
			 
			 //Make a new note
			 if(e.getSource() == newNote) {
				 titleField.setText("Title");
				 noteArea.setText("Note");
			 }
			 
			 //Save the note as an object
			 if(e.getSource() == saveNote) {
				 Save saver = new Save();
				 saver.SaveFile(noteArea.getText(), titleField.getText());
			 }
			 
			 //Load a saved note
			 if(e.getSource() == loadNote) {
				 
			 }
			 
			 //Change the text to bold
			 if(e.getSource() == boldIt) {
				 //If it's not already bold, then make it so.
				 if(!noteArea.getFont().isBold()) {
					 titleField.setFont(new Font(titleField.getFont().getFontName(),1,15));
					 noteArea.setFont(new Font(noteArea.getFont().getFontName(),1,15));
				 } else {
					 titleField.setFont(new Font(titleField.getFont().getFontName(),0,15));
					 noteArea.setFont(new Font(noteArea.getFont().getFontName(),0,15));
				 }
			 }
			 
			 //Change to italics
			 if(e.getSource() == italicIt) {
				 if(!noteArea.getFont().isItalic()) {
					 titleField.setFont(new Font(titleField.getFont().getFontName(),2,15));
					 noteArea.setFont(new Font(noteArea.getFont().getFontName(),2,15));
				 } else {
					 titleField.setFont(new Font(titleField.getFont().getFontName(),0,15));
					 noteArea.setFont(new Font(noteArea.getFont().getFontName(),0,15));
				 }
			 }
			 
			 if(e.getSource() == changeFont) {
				 FontsWindow fw = new FontsWindow("Fonts");
				 fw.setVisible(true);
			 }
			 
			 //Bulleted list
			 if(e.getSource() == bulletedList) {
				 noteArea.setText(noteArea.getText().substring(0,noteArea.getSelectionStart()) + "\n • " + noteArea.getText().substring(noteArea.getSelectionStart()));
			 }
			 
			 //Numbered list
			 if(e.getSource() == numberedList) {
				 noteArea.setText(noteArea.getText().substring(0,noteArea.getSelectionStart()) + "\n " + num + ".) " + noteArea.getText().substring(noteArea.getSelectionStart()));
				 num++;
			 }
			 
			 //Find/Replace
			 if(e.getSource() == findReplace) {
				 FindReplaceWindow frw = new FindReplaceWindow("Find/Replace",noteArea);
				 frw.setVisible(true);
			 }
			 
		 }
		 
		 
	 }
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
}