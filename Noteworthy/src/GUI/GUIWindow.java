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
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ScrollPaneConstants;
import javax.swing.event.UndoableEditEvent;
import javax.swing.event.UndoableEditListener;
import javax.swing.text.DefaultHighlighter;
import javax.swing.text.Highlighter;
import javax.swing.undo.CannotRedoException;
import javax.swing.undo.UndoManager;

import FILE.ExtensionFilter;
import MAIN.NoteArea;
import contents.ReadFile;
import contents.Save;

public class GUIWindow extends JFrame {
	private static final long serialVersionUID = 2054181992322087814L;
	
	JFrame guiwindow;
	
	//The menu bar
	JMenuBar menubar = new JMenuBar();
	
	//Buttons for loading, saving, and making a new note
	JButton newNote = new JButton("New Note");
	JButton saveNote = new JButton("Save Note");
	JButton saveAsNote = new JButton("Save As");
	JButton loadNote = new JButton("Open Note");
	
	//Buttons for bolding, italicizing, and changing the font
	JButton boldIt = new JButton("Bold");
	JButton italicIt = new JButton("Italic");
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
	JTextArea noteArea = new NoteArea("Note", this);

	//The file chooser
	public final JFileChooser fileChooser = new JFileChooser();
	
	//Undo manager
	public UndoManager undoManager = new UndoManager();
	
	//Highlighter
	public Highlighter.HighlightPainter yellowHighlight = new DefaultHighlighter.DefaultHighlightPainter(Color.yellow);
	
	
	public GUIWindow(String title) {
		 super(title);
		 guiwindow = this;
		 
		 /* MENU SETUP */
		 setJMenuBar(menubar);
		 setupMenuBar();
		 
		 /* INITIAL SETUP */	 
		 Font defaultFont = new Font("Comic Sans MS", 0, 16);
		 titleField.setFont(defaultFont);
		 noteArea.setFont(defaultFont);
		 noteArea.setLineWrap(true);
		 noteArea.setWrapStyleWord(true);

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
	
	 /** Add the necessary elements to the menu bar. */
	 private void setupMenuBar() {
		 JMenu file = new JMenu("File");
		 	JMenuItem NEWNOTE = new JMenuItem("New Note");
		 	JMenuItem OPENNOTE = new JMenuItem("Open Note");
		 	JMenuItem SAVENOTE = new JMenuItem("Save Note");
		 	JMenuItem SAVEAS = new JMenuItem("Save As");
		 	JMenuItem QUIT = new JMenuItem("Quit");
		 	file.add(NEWNOTE);
		 	file.add(OPENNOTE);
		 	file.add(SAVENOTE);
		 	file.add(SAVEAS);
		 	file.add(QUIT);
		 JMenu edit = new JMenu("Edit");
		 	JMenuItem UNDO = new JMenuItem("Undo");
		 	JMenuItem REDO = new JMenuItem("Redo");
		 	JMenuItem FINDREPLACE = new JMenuItem("Find/Replace");
		 	JMenuItem HIGHLIGHT = new JMenuItem("Highlight");
		 	edit.add(UNDO);
		 	edit.add(REDO);
		 	edit.add(FINDREPLACE);
		 	edit.add(HIGHLIGHT);
		 JMenu window = new JMenu("Window");
		 	JMenuItem MINIMIZE = new JMenuItem("Minimize");
		 	JMenuItem MAXIMIZE = new JMenuItem("Maximize");
		 	window.add(MINIMIZE);
		 	window.add(MAXIMIZE);		 	
		 JMenu help = new JMenu("Help");
		 	JMenuItem ABOUT = new JMenuItem("About");
		 	JMenuItem KEYHELP = new JMenuItem("Key Help");
		 	help.add(ABOUT);
		 	help.add(KEYHELP);
		 	
		 menubar.add(file);
		 menubar.add(edit);
		 menubar.add(window);
		 menubar.add(help);
		 
		 NEWNOTE.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				titleField.setText("Title");
				noteArea.setText("Note");
			}
		 });
		 OPENNOTE.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
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
		 });
		 SAVENOTE.addActionListener(new ActionListener() {
			@Override
				public void actionPerformed(ActionEvent e) {
					Save saver = new Save();
					saver.SaveFile(noteArea.getText(), titleField.getText() + ".ntwy");
				}
		 });
		 SAVEAS.addActionListener(new ActionListener() {
			 @Override
				public void actionPerformed(ActionEvent e) {
					int val = fileChooser.showSaveDialog(guiwindow);
					
					if(val == JFileChooser.APPROVE_OPTION) {
						Save saver = new Save();
						if(fileChooser.getFileFilter().getDescription().equals("txt -- A plain text file."))
							saver.SaveFile(noteArea.getText(), fileChooser.getCurrentDirectory().getAbsolutePath() + "/" + titleField.getText() + ".txt");
						else if(fileChooser.getFileFilter().getDescription().equals("ntwy -- A Noteworthy text file."))
							saver.SaveFile(noteArea.getText(), fileChooser.getCurrentDirectory().getAbsolutePath() + "/" + titleField.getText() + ".ntwy");
							
					}
				}
		 });
		 QUIT.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				System.exit(0);
			}			 
		 });
		 UNDO.addActionListener(new ActionListener() {
			@Override
				public void actionPerformed(ActionEvent e) {
				 	try {
				 		undoManager.undo();
			        } catch (Exception err) {
			        	System.err.println("Nothing to undo!");
			        }
				}
		 });
		 REDO.addActionListener(new ActionListener() {
			@Override
				public void actionPerformed(ActionEvent e) {
					try {
						undoManager.redo();
			        } catch (CannotRedoException err) {
			          	System.err.println("Nothing to redo!");
			        }
				} 
		 });
		 FINDREPLACE.addActionListener(new ActionListener() {
			 @Override
				public void actionPerformed(ActionEvent e) {
					FindReplaceWindow frw = new FindReplaceWindow("Find/Replace",noteArea);
					frw.setVisible(true);
				}
		 });
		 HIGHLIGHT.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					noteArea.getHighlighter().addHighlight(noteArea.getSelectionStart(), noteArea.getSelectionEnd(), yellowHighlight);
				} catch(Exception err) {
					System.err.println("There was a problem highlighting the text.");
				}
			} 
		 });
		 MINIMIZE.addActionListener(new ActionListener() {
			 @Override
				public void actionPerformed(ActionEvent e) {
					guiwindow.setState(JFrame.ICONIFIED);
				}
		 });
		 MAXIMIZE.addActionListener(new ActionListener() {
			 @Override
				public void actionPerformed(ActionEvent e) {
					guiwindow.setState(JFrame.NORMAL);
				}
		 });
		 ABOUT.addActionListener(new ActionListener() {
			 @Override
				public void actionPerformed(ActionEvent e) {
					AboutWindow aw = new AboutWindow("About");
					aw.setVisible(true);
				}
		 });
		 KEYHELP.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				KeyHelp kh = new KeyHelp("Key Help");
				kh.setVisible(true);
			}
		 });
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
				 saver.SaveFile(noteArea.getText(), titleField.getText() + ".ntwy");
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
				 FontsWindow fw = new FontsWindow("Fonts", noteArea);
				 fw.setVisible(true);
			 }
			 
			 //Bulleted list
			 if(e.getSource() == bulletedList) {
				 noteArea.setText(noteArea.getText().substring(0,noteArea.getSelectionStart()) + "\n • \n" + noteArea.getText().substring(noteArea.getSelectionStart()));
			 }
			 
			 //Numbered list
			 if(e.getSource() == numberedList) {
				 noteArea.setText(noteArea.getText().substring(0,noteArea.getSelectionStart()) + "\n " + num + ".) \n" + noteArea.getText().substring(noteArea.getSelectionStart()));
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