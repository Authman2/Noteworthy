package MAIN;

import java.awt.event.KeyEvent;

import javax.swing.JTextArea;

public class NoteArea extends JTextArea {
	private static final long serialVersionUID = 301547767165899971L;

	//The indexes of the current and previous bullet points
	int currBullet = -1, prevBullet = -1;
	
	
	public NoteArea(String title) { super(title); }
	
	@Override
	protected void processKeyEvent(KeyEvent e) {
		super.processKeyEvent(e);
		
		if(e.getKeyCode() == KeyEvent.VK_ENTER) {
			if(onSameLine()) {
				setText(getText().substring(0, getSelectionStart()-1) + "\n • \n" + getText().substring(getSelectionStart()));
			}
		}
	}
	
	/** Checks if the selection start is on the same line as a bulleted list. */
	public boolean onSameLine() {
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
	
}
