package MAIN;

import java.awt.event.KeyEvent;
import java.awt.event.MouseEvent;

import javax.swing.JTextArea;

import GUI.GUIWindow;

public class NoteArea extends JTextArea {
	private static final long serialVersionUID = 301547767165899971L;
	
	//GUIWindow for grabbing data from
	GUIWindow guiwindow;
	
	//A boolean for when a mouse click will get rid of the highlights
	public boolean hasHighlights;
	
	
	public NoteArea(String title, GUIWindow gw) { super(title); guiwindow = gw; }
	
	@Override
	protected void processMouseEvent(MouseEvent e) {
		super.processMouseEvent(e);
		
		if(e.getButton() == MouseEvent.BUTTON1 && hasHighlights) {
			getHighlighter().removeAllHighlights();
			hasHighlights = false;
		}
	}
	
	@Override
	protected void processKeyEvent(KeyEvent e) {
		super.processKeyEvent(e);
		
		if(e.getKeyCode() == KeyEvent.VK_ENTER) {
			if(onBulletedLine()) {
				setText(getText().substring(0, getSelectionStart()-1) + "\n • \n" + getText().substring(getSelectionStart()));
			}
			
			if(onNumberedLine()) {
				setText(getText().substring(0,getSelectionStart()-1) + "\n " + guiwindow.num + ".) \n" + getText().substring(getSelectionStart()));
				guiwindow.num++;
			}
			
			
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
