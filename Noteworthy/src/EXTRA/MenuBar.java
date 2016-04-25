package EXTRA;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.util.ArrayList;

import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JMenu;
import javax.swing.JMenuItem;
import javax.swing.text.BadLocationException;
import javax.swing.undo.CannotRedoException;

import GUI.AboutWindow;
import GUI.FindReplaceWindow;
import GUI.GUIWindow;
import GUI.KeyHelpWindow;
import GUI.WordcountWindow;
import contents.Load;
import contents.Save;
import contents.TextStyle;

public class MenuBar {

	GUIWindow guiwindow;
	
	//String to be copied
	public String copy;
	
	
	public MenuBar(GUIWindow g) {
		guiwindow = g;
	}

	
	public void setup() {
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
		 	JMenuItem COPY = new JMenuItem("Copy");
		 	JMenuItem PASTE = new JMenuItem("Paste");
		 	JMenuItem FINDREPLACE = new JMenuItem("Find/Replace");
		 	JMenuItem HIGHLIGHT = new JMenuItem("Highlight");
		 	edit.add(UNDO);
		 	edit.add(REDO);
		 	edit.addSeparator();
		 	edit.add(COPY);
		 	edit.add(PASTE);
		 	edit.addSeparator();
		 	edit.add(FINDREPLACE);
		 	edit.add(HIGHLIGHT);
		 JMenu insert = new JMenu("Insert");
		 	JMenuItem TABLE = new JMenuItem("Table");
		 	insert.add(TABLE);
		 JMenu tools = new JMenu("Tools");
		 	JMenuItem WORDCOUNT = new JMenuItem("Word Count");
		 	tools.add(WORDCOUNT);
		 JMenu share = new JMenu("Share");
		 	JMenuItem LOGIN = new JMenuItem("Log In");
		 	JMenuItem SIGNUP = new JMenuItem("Sign Up");
		 	JMenuItem SYNC = new JMenuItem("Sync");
		 	share.add(LOGIN);
		 	share.add(SIGNUP);
		 	share.add(SYNC);
		 JMenu window = new JMenu("Window");
		 	JMenuItem MINIMIZE = new JMenuItem("Minimize");
		 	window.add(MINIMIZE);
		 JMenu help = new JMenu("Help");
		 	JMenuItem ABOUT = new JMenuItem("About");
		 	JMenuItem KEYHELP = new JMenuItem("Key Help");
		 	help.add(ABOUT);
		 	help.add(KEYHELP);
		 	
		 guiwindow.menubar.add(file);
		 guiwindow.menubar.add(edit);
		 guiwindow.menubar.add(insert);
		 guiwindow.menubar.add(tools);
		 guiwindow.menubar.add(share);
		 guiwindow.menubar.add(window);
		 guiwindow.menubar.add(help);
		 
		 NEWNOTE.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				guiwindow.titleField.setText("Title");
				guiwindow.noteArea.setText("Note");
			}
		 });
		 OPENNOTE.addActionListener(new ActionListener() {
			@SuppressWarnings("unchecked")
			@Override
			public void actionPerformed(ActionEvent e) {
				 int val = guiwindow.fileChooser.showOpenDialog(guiwindow);
					
				 if(val == JFileChooser.APPROVE_OPTION) {
					//Load the text in the note
					 File f = guiwindow.loadNoteText();
					 
					 //Load all of the styling attributes
					 Load loader = new Load();
					 guiwindow.textstyles = (ArrayList<TextStyle>) loader.LoadFile(guiwindow.textstyles, guiwindow.fileChooser.getCurrentDirectory().getAbsolutePath() + "/" + f.getName().substring(0, f.getName().length()-5) + "_styles");
					 
					 //Set the style attributes again
					 for(TextStyle ts : guiwindow.textstyles) {
						 ts.setTextPane(guiwindow.noteArea);
						 ts.addStyle();
					 }
					 
				 }	
			}
		 });
		 SAVENOTE.addActionListener(new ActionListener() {
			@Override
				public void actionPerformed(ActionEvent e) {
					Save saver = new Save();

					saver.SaveFile(guiwindow.textstyles, guiwindow.titleField.getText() + "_styles");
					saver.SaveFile(guiwindow.noteArea.getText(), guiwindow.titleField.getText() + ".ntwy");
				}
		 });
		 SAVEAS.addActionListener(new ActionListener() {
			 @Override
				public void actionPerformed(ActionEvent e) {
					int val = guiwindow.fileChooser.showSaveDialog(guiwindow);
					
					if(val == JFileChooser.APPROVE_OPTION) {
						Save saver = new Save();
						
						saver.SaveFile(guiwindow.textstyles, guiwindow.fileChooser.getCurrentDirectory().getAbsolutePath() + "/" + guiwindow.titleField.getText() + "_styles");
						if(guiwindow.fileChooser.getFileFilter().getDescription().equals("txt -- A plain text file."))
							saver.SaveFile(guiwindow.noteArea.getText(), guiwindow.fileChooser.getCurrentDirectory().getAbsolutePath() + "/" + guiwindow.titleField.getText() + ".txt");
						else if(guiwindow.fileChooser.getFileFilter().getDescription().equals("ntwy -- A Noteworthy text file."))
							saver.SaveFile(guiwindow.noteArea.getText(), guiwindow.fileChooser.getCurrentDirectory().getAbsolutePath() + "/" + guiwindow.titleField.getText() + ".ntwy");
							
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
				 		guiwindow.undoManager.undo();
			        } catch (Exception err) {
			        	System.err.println("Nothing to undo!");
			        }
				}
		 });
		 REDO.addActionListener(new ActionListener() {
			@Override
				public void actionPerformed(ActionEvent e) {
					try {
						guiwindow.undoManager.redo();
			        } catch (CannotRedoException err) {
			          	System.err.println("Nothing to redo!");
			        }
				} 
		 });
		 COPY.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				copy = guiwindow.noteArea.getText().substring(guiwindow.noteArea.getSelectionStart(), guiwindow.noteArea.getSelectionEnd());
			}
		 });
		 PASTE.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					guiwindow.noteArea.getStyledDocument().insertString(guiwindow.noteArea.getSelectionStart(), copy, null);
				} catch (BadLocationException e1) {
					e1.printStackTrace();
				}
			}
		 });
		 FINDREPLACE.addActionListener(new ActionListener() {
			 @Override
				public void actionPerformed(ActionEvent e) {
					FindReplaceWindow frw = new FindReplaceWindow("Find/Replace",guiwindow.noteArea);
					frw.setVisible(true);
				}
		 });
		 HIGHLIGHT.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {				
				try {
					guiwindow.noteArea.getHighlighter().addHighlight(guiwindow.noteArea.getSelectionStart(), guiwindow.noteArea.getSelectionEnd(), guiwindow.highlighter);
				} catch(Exception err) {
					System.err.println("There was a problem highlighting the text.");
				}
			} 
		 });
		 TABLE.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				InsertTableWindow itw = new InsertTableWindow(guiwindow.noteArea);
				itw.setVisible(true);
			}
		 });
		 WORDCOUNT.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				WordcountWindow wcw = new WordcountWindow(guiwindow);
				wcw.setVisible(true);
			}
		 });
		 LOGIN.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				LogInSignUpWindow lisuw = new LogInSignUpWindow("Log In");
				lisuw.select.setText("Log In");
				lisuw.setVisible(true);
			}
		 });
		 SIGNUP.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				LogInSignUpWindow lisuw = new LogInSignUpWindow("Sign Up");
				lisuw.select.setText("Sign Up");
				lisuw.setVisible(true);
			}
		 });
		 MINIMIZE.addActionListener(new ActionListener() {
			 @Override
				public void actionPerformed(ActionEvent e) {
					guiwindow.holdingframe.setState(JFrame.ICONIFIED);
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
				KeyHelpWindow khw = new KeyHelpWindow("Key Help");
				khw.setVisible(true);
			}
		 });
	}

}
