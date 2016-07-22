package MAIN;

import java.awt.event.KeyEvent;
import java.awt.event.MouseEvent;
import java.io.File;

import javax.swing.JFileChooser;
import javax.swing.JTextPane;
import javax.swing.text.Highlighter.Highlight;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.text.StyleConstants;

import GUI.FindReplaceWindow;
import GUI.GUIWindow;
import GUI.KeyHelpWindow;
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
public class NoteArea extends JTextPane {
	private static final long serialVersionUID = 301547767165899971L;
	
	//GUIWindow for grabbing data from
	GUIWindow guiwindow;
	
	//A boolean for when a mouse click will get rid of the highlights
	public boolean hasHighlights;
	
	//Booleans for whether or not certain keys are being held down
	boolean commandDown = false, shiftDown = false;
	
	//Simple Attribute Set
	public SimpleAttributeSet sas;
		
	
	
	public NoteArea(GUIWindow gw) {
		guiwindow = gw; 
		sas = new SimpleAttributeSet();
	}
	
	@Override
	protected void processMouseEvent(MouseEvent e) {
		super.processMouseEvent(e);
		
		if(e.getButton() == MouseEvent.BUTTON1 && hasHighlights) {
			for(Highlight h : getHighlighter().getHighlights()) {
				if(!h.getPainter().equals(guiwindow.highlighter)) {
					getHighlighter().removeHighlight(h);
				}
			}
			hasHighlights = false;
		}
	}
	
	public GUIWindow getGUIWindow() {
		return guiwindow;
	}
	
	public void ResetStyles() {
		StyleConstants.setBold(sas, false);
		StyleConstants.setItalic(sas, false);
		StyleConstants.setUnderline(sas, false);
		StyleConstants.setStrikeThrough(sas, false);
	}
	
	@Override
	protected void processKeyEvent(KeyEvent e) {
		super.processKeyEvent(e);
		
		if(e.getKeyCode() == KeyEvent.VK_ENTER) {
			if(onBulletedLine()) {
				try {
					getDocument().insertString(getSelectionStart(), "\n • \n", sas);
				 } catch(Exception err) {
					 err.printStackTrace();
				 }
			}
			
			if(onNumberedLine()) {
				try {
					getDocument().insertString(getSelectionStart(), "\n " + guiwindow.num + ".) \n", sas);
				 } catch(Exception err) {
					 err.printStackTrace();
				 }
				guiwindow.num++;
			}
		}
		
		
		
		/* HOT HEYS */
		if(e.getKeyCode() == KeyEvent.VK_META || e.getKeyCode() == KeyEvent.VK_WINDOWS) { 
			commandDown = true; 
			ResetStyles();
		}	
		if(e.getKeyCode() == KeyEvent.VK_SHIFT) { 
			shiftDown = true; 
			ResetStyles();
		}
		if(e.getKeyCode() == 0) { 
			commandDown = false;
			shiftDown = false;
			ResetStyles();
		}
		
		
		configureHotKeys(e);
	}
	
	private void configureHotKeys(KeyEvent e) {
		//Save
		if(e.getKeyCode() == KeyEvent.VK_S && commandDown == true) {
			Save saver = new Save();
			saver.SaveFile(getText(), guiwindow.titleField.getText() + ".ntwy");
			commandDown = false;
		}
		
		//Save As
		if(e.getKeyCode() == KeyEvent.VK_S && commandDown == true && shiftDown == true) {
			int val = guiwindow.fileChooser.showSaveDialog(guiwindow);
			
			if(val == JFileChooser.APPROVE_OPTION) {
				Save saver = new Save();
				if(guiwindow.fileChooser.getFileFilter().getDescription().equals("txt -- A plain text file."))
					saver.SaveFile(getText(), guiwindow.fileChooser.getCurrentDirectory().getAbsolutePath() + "/" + guiwindow.titleField.getText() + ".txt");
				else if(guiwindow.fileChooser.getFileFilter().getDescription().equals("ntwy -- A Noteworthy text file."))
					saver.SaveFile(getText(), guiwindow.fileChooser.getCurrentDirectory().getAbsolutePath() + "/" + guiwindow.titleField.getText() + ".ntwy");
					
			}
			
			commandDown = false;
			shiftDown = false;
		}
		
		//New Note
		if(e.getKeyCode() == KeyEvent.VK_N && commandDown == true) {
			guiwindow.titleField.setText("Title");
			setText("Note");
			commandDown = false;
		}
		
		//Open Note
		if(e.getKeyCode() == KeyEvent.VK_O && commandDown == true) {			
			 int val = guiwindow.fileChooser.showOpenDialog(guiwindow);
				
			 if(val == JFileChooser.APPROVE_OPTION) {
				 //The file to grab.
				 File file = guiwindow.fileChooser.getSelectedFile();
				
				 //Using my "ReadFile" class.
				 ReadFile reader = new ReadFile();
				 String loadedNote = "";
				
				 //Try loading the file's text
				 try { loadedNote = reader.read(file.getPath()); } catch (Exception e1) { e1.printStackTrace(); }
	            
				 //Set the texts
				 if(file.getName().endsWith(".ntwy"))
				 	guiwindow.titleField.setText(file.getName().substring(0, file.getName().length()-5));
				 else
					 guiwindow.titleField.setText(file.getName().substring(0, file.getName().length()-4));
				 setText(loadedNote.substring(7));
			 }
			commandDown = false;
		}
		
		
		//Undo 
		if(e.getKeyCode() == KeyEvent.VK_Z && commandDown == true) {
			try {
		 		guiwindow.undoManager.undo();
	        } catch (Exception err) {
	        	System.err.println("Nothing to undo!");
	        }
			commandDown = false;
		}
		
		//Redo
		if(e.getKeyCode() == KeyEvent.VK_Z && commandDown == true && shiftDown == true) {
			try {
		 		guiwindow.undoManager.redo();
	        } catch (Exception err) {
	        	System.err.println("Nothing to undo!");
	        }
			commandDown = false;
			shiftDown = false;
		}
		
		//Find/Replace
		if(e.getKeyCode() == KeyEvent.VK_F && commandDown == true) {
			FindReplaceWindow frw = new FindReplaceWindow("Find/Replace",this);
			frw.setVisible(true);
			commandDown = false;
		}
		
		//Highlight
		if(e.getKeyCode() == KeyEvent.VK_H && commandDown == true && shiftDown == true) {
			try {
				getHighlighter().addHighlight(getSelectionStart(), getSelectionEnd(), guiwindow.highlighter);
			} catch(Exception err) {
				System.err.println("There was a problem highlighting the text.");
			}
			commandDown = false;
			shiftDown = false;
		}
		
		//Key Help
		if(e.getKeyCode() == KeyEvent.VK_K && commandDown) {
			KeyHelpWindow khw = new KeyHelpWindow("Key Help");
			khw.setVisible(true);
			commandDown = false;
		}
		
		//Bold
		if(e.getKeyCode() == KeyEvent.VK_B && commandDown) {
			int selectionLength = getText().substring(getSelectionStart(),getSelectionEnd()).length();
			TextStyle t = new TextStyle(this, getSelectionStart(), selectionLength, "BOLD");
			t.addStyle();
			guiwindow.textstyles.add(t);
			commandDown = false;
		}
		
		//Italic
		if(e.getKeyCode() == KeyEvent.VK_I && commandDown) {
			int selectionLength = getText().substring(getSelectionStart(),getSelectionEnd()).length();
			TextStyle t = new TextStyle(this, getSelectionStart(), selectionLength, "ITALIC");
			t.addStyle();
			guiwindow.textstyles.add(t);
			commandDown = false;
		}
		
		//Underline
		if(e.getKeyCode() == KeyEvent.VK_U && commandDown) {
			int selectionLength = getText().substring(getSelectionStart(),getSelectionEnd()).length();
			TextStyle t = new TextStyle(this, getSelectionStart(), selectionLength, "UNDERLINE");
			t.addStyle();
			guiwindow.textstyles.add(t);
			commandDown = false;
		}
		
		//Strike through
		if(e.getKeyCode() == KeyEvent.VK_5 && commandDown && shiftDown) { 
			int selectionLength = getText().substring(getSelectionStart(),getSelectionEnd()).length();
			TextStyle t = new TextStyle(this, getSelectionStart(), selectionLength, "STRIKETHROUGH");
			t.addStyle();
			guiwindow.textstyles.add(t);
			commandDown = false;
			shiftDown = false;
		}
		
		
		/*
		 * 
		 * 
		 * DOESN'T WORK YET
		 * 
		 * 
		 * */
		//Subscript
		if(e.getKeyCode() == KeyEvent.VK_PERIOD && commandDown) {
			int selectionLength = getText().substring(getSelectionStart(),getSelectionEnd()).length();
			TextStyle t = new TextStyle(this, getSelectionStart(), selectionLength, "SUBSCRIPT");
			t.addStyle();
			guiwindow.textstyles.add(t);
			commandDown = false;
		}
		
		//Superscript
		if(e.getKeyCode() == KeyEvent.VK_COMMA && commandDown) {
			int selectionLength = getText().substring(getSelectionStart(),getSelectionEnd()).length();
			TextStyle t = new TextStyle(this, getSelectionStart(), selectionLength, "SUPERSCRIPT");
			t.addStyle();
			guiwindow.textstyles.add(t);
			commandDown = false;
		}
	}
	
	/** Checks if the selection start is on the same line as a bulleted list. */
	public boolean onBulletedLine() {
		//Start from where you are, and loop backwards until you find a bullet point
		int i = getSelectionStart();
		String temp = "";
		
		try {
			//If you find a line break, then you know your not on the same line anymore
			while(!getText().substring(i-2, i-1).equals("\n")) {
				//Add whatever text you find to temp
				temp += getText().substring(i-1, i);
				i--;
			}
		} catch(Exception e) {
			System.err.println("Not on a bulleted list line.");
		}
		
		//Check if there was a bullet point there. If so, return true. False otherwise.
		if(temp.indexOf("•") > -1) {
			return true;
		}
		
		return false;
	}
	
	
	/** Checks if the selection start is on the same line as a numbered list. */
	public boolean onNumberedLine() {
		int i = getSelectionStart();
		String temp = "";
		
		try {
			//If you find a line break, then you know your not on the same line anymore
			while(!getText().substring(i-2, i-1).equals("\n")) {
				//Add whatever text you find to temp
				temp += getText().substring(i-1, i);
				i--;
			}
		} catch(Exception e) {
			System.err.println("Not on a numbered list line.");
		}
		
		//Check if there was a 'dot parenthese' there. If so, return true. False otherwise.
		if(temp.indexOf(").") > -1) {
			return true;
		}
		
		
		return false;
	}
	
}
