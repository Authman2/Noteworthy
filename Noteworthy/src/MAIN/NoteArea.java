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
				setText(getText().substring(0, getSelectionStart()-1) + "\n • " + getText().substring(getSelectionStart()));
			}
		}
	}
	
	public boolean onSameLine() {
//		//Start from where you are, and loop backwards until you find a bullet point
//		int i = getSelectionStart();
//		String temp = "";
//		while(!getText().substring(i-1, i).equals("\n")) {
//			temp += getText().substring(i-1, i);
//			i--;
//		}
//		System.out.println(temp);
		
		for(int i = getSelectionStart(); i > getText().indexOf("\n"); i--) {
			if(getText().substring(i-1, i).equals("•")) {
				return true;
			}
		}
		
		
		
		return false;
	}
	
}
