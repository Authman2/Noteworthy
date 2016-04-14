package GUI;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLayeredPane;
import javax.swing.JMenuBar;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.ScrollPaneConstants;
import javax.swing.event.UndoableEditEvent;
import javax.swing.event.UndoableEditListener;
import javax.swing.text.BadLocationException;
import javax.swing.text.DefaultHighlighter;
import javax.swing.text.Highlighter;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.text.StyleConstants;
import javax.swing.undo.CannotRedoException;
import javax.swing.undo.UndoManager;

import EXTRA.MenuBar;
import FILE.ExtensionFilter;
import MAIN.NoteArea;
import contents.ReadFile;
import contents.Save;

public class GUIWindow extends JFrame {
	private static final long serialVersionUID = 2054181992322087814L;
	
	//This JFrame
	JFrame guiwindow;
	
	//The menu bar
	public JMenuBar menubar = new JMenuBar();
	
	//Buttons for loading, saving, and making a new note
	JButton newNote = new JButton("New Note");
	JButton saveNote = new JButton("Save Note");
	JButton saveAsNote = new JButton("Save As");
	JButton loadNote = new JButton("Open Note");
	
	//Buttons for bolding, italicizing, and changing the font
	JButton boldIt = new JButton("<html><b> Bold </b></html>");
	JButton italicIt = new JButton("<html><i> Italic </i></html>");
	JButton underlineIt = new JButton("<html><u> Underline </u><html>");
	JButton strikethroughIt = new JButton("<html><strike> Strikethrough </strike></html>");
	JButton changeFont = new JButton("Fonts");
	
	//Button that opens up the find/replace window
	JButton findReplace = new JButton("Find/Replace");
	
	//Creating bulleted and numbered lists, and a number to track the numbered list
	JButton bulletedList = new JButton("•--- •---");
	JButton numberedList = new JButton("1.) --- 2.) ---");
	public int num = 1;
	
	//Undo/Redo Buttons
	JButton undoButton = new JButton("Undo");
	JButton redoButton = new JButton("Redo");
	
	//A text field and area for writing notes
	public JTextField titleField = new JTextField("Title");
	public NoteArea noteArea = new NoteArea(this);

	//The file chooser
	public final JFileChooser fileChooser = new JFileChooser();
	
	//Undo manager
	public UndoManager undoManager = new UndoManager();
	
	//Simple Attribute Set
	SimpleAttributeSet sas;
	
	//Highlighter
	public Highlighter.HighlightPainter yellowHighlight = new DefaultHighlighter.DefaultHighlightPainter(Color.yellow);
	
	//The menu bar setup
	MenuBar menu;
	
	
	
	public GUIWindow(String title) {
		 super(title);
		 noteArea.setText("Note");
		 sas = new SimpleAttributeSet();
		 guiwindow = this;
		 
		 /* MENU SETUP */
		 setJMenuBar(menubar);
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
		 Container pane = getContentPane();
		 JLayeredPane layeredPane = new JLayeredPane();
		 pane.add(layeredPane, BorderLayout.CENTER);
		 setupPanels(layeredPane);
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
	 }
	
	/** Add all of the components to the appropriate panels. */
	 private void setupPanels(JLayeredPane layeredPane) {
		//Buttons panel
		 JPanel buttonsPanel = new JPanel();
		 	buttonsPanel.setBounds(5, 5, 630, 100);
		 	buttonsPanel.setLayout(new GridLayout(3,5,10,10));
		 	buttonsPanel.add(newNote);
		 	buttonsPanel.add(saveNote);
		 	buttonsPanel.add(saveAsNote);
		 	buttonsPanel.add(loadNote);
		 	buttonsPanel.add(boldIt);
		 	buttonsPanel.add(italicIt);
		 	buttonsPanel.add(underlineIt);
		 	buttonsPanel.add(strikethroughIt);
		 	buttonsPanel.add(changeFont);
		 	buttonsPanel.add(findReplace);
		 	buttonsPanel.add(bulletedList);
		 	buttonsPanel.add(numberedList);
		 	buttonsPanel.add(undoButton);
			buttonsPanel.add(redoButton);
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
	
	 /** All the actions that can be performed through clicking the buttons. */
	 public class actions implements ActionListener {
		 
		 @Override
		 public void actionPerformed(ActionEvent e) {
			 
			 //Make a new note
			 if(e.getSource() == newNote) {
				 titleField.setText("Title");
				 noteArea.setText("Note");
				 StyleConstants.setBold(sas, false);
				 StyleConstants.setItalic(sas, false);
				 StyleConstants.setUnderline(sas, false);
				 StyleConstants.setStrikeThrough(sas, false);
			 }
			 
			 //Save the note as an object
			 if(e.getSource() == saveNote) {
				 Save saver = new Save();
				 try {
					saver.SaveFile(noteArea.getStyledDocument().getText(0, noteArea.getText().length()), titleField.getText() + ".ntwy");
				} catch (BadLocationException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			 }
			 
			 //Load a saved note
			 if(e.getSource() == loadNote) {
				 int val = fileChooser.showOpenDialog(guiwindow);
				
				 if(val == JFileChooser.APPROVE_OPTION) {
					 //The file to grab.
					 File file = fileChooser.getSelectedFile();
					
					 //Using my "ReadFile" class.
					 ReadFile reader = new ReadFile();
					 String loadedNote = "";
					
					 //Try loading the file's text
					 try { loadedNote = (String)reader.Read(file.getPath()); } catch (Exception e1) { e1.printStackTrace(); }
		            
					 //Set the texts
					 if(file.getName().endsWith(".ntwy"))
					 	titleField.setText(file.getName().substring(0, file.getName().length()-5));
					 else
						 titleField.setText(file.getName().substring(0, file.getName().length()-4));
					 noteArea.setText(loadedNote.substring(7));
				 }
			 }
			 
			 //Change the text to bold
			 if(e.getSource() == boldIt) {
				 StyleConstants.setBold(sas, !StyleConstants.isBold(sas));
				 int selectionLength = noteArea.getText().substring(noteArea.getSelectionStart(),noteArea.getSelectionEnd()).length();
				 noteArea.getStyledDocument().setCharacterAttributes(noteArea.getSelectionStart(), selectionLength, sas, false);
			 }
			 
			 //Change to italics
			 if(e.getSource() == italicIt) {
				 StyleConstants.setItalic(sas, !StyleConstants.isItalic(sas));
				 int selectionLength = noteArea.getText().substring(noteArea.getSelectionStart(),noteArea.getSelectionEnd()).length();
				 noteArea.getStyledDocument().setCharacterAttributes(noteArea.getSelectionStart(), selectionLength, sas, false);
			 }
			 
			 //Change to underline
			 if(e.getSource() == underlineIt) {
				 StyleConstants.setUnderline(sas, !StyleConstants.isUnderline(sas));
				 int selectionLength = noteArea.getText().substring(noteArea.getSelectionStart(),noteArea.getSelectionEnd()).length();
				 noteArea.getStyledDocument().setCharacterAttributes(noteArea.getSelectionStart(), selectionLength, sas, false);
			 }
			 
			 //Strikethrough
			 if(e.getSource() == strikethroughIt) { 
				 StyleConstants.setStrikeThrough(sas, !StyleConstants.isStrikeThrough(sas));
				 int selectionLength = noteArea.getText().substring(noteArea.getSelectionStart(),noteArea.getSelectionEnd()).length();
				 noteArea.getStyledDocument().setCharacterAttributes(noteArea.getSelectionStart(), selectionLength, sas, false);
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
		 }
		 
		 
	 }

	 
	 /** Handles the undo feature. */
	 public class undolistener implements UndoableEditListener {
		@Override
		public void undoableEditHappened(UndoableEditEvent e) {
			undoManager.addEdit(e.getEdit());
		}
	 }
	 
	 
	 
}