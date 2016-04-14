package GUI;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.util.ArrayList;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class WordcountWindow extends JFrame {
	private static final long serialVersionUID = -8320427500013217560L;

	
	GUIWindow guiwindow;
	
	
	JLabel withoutSpaces = new JLabel("		Without Spaces: ");
	JLabel characterCount = new JLabel("	Character Count: ");
	JLabel characterCountSpc = new JLabel("	Character Count (Without Spaces): ");
	
	
	
	
	public WordcountWindow(GUIWindow g) {
		super("Word Count");
		guiwindow = g;
		setSize(300,300);
		setLocationRelativeTo(null);
		
		setWithoutLabel();
		
		JPanel center = new JPanel(new GridLayout(3,1,10,10));
			center.add(withoutSpaces);
			center.add(characterCount);
			center.add(characterCountSpc);
			
		getContentPane().add(center, BorderLayout.CENTER);
	}

	/** Find the number of words without spaces */
	private void setWithoutLabel() {
		
		//Loop through to find the first space
		int i = 0;
		int firstSpace = -1, lastSpace = -1;
		String guitext = guiwindow.noteArea.getText();
		ArrayList<String> temp = new ArrayList<String>();
		
		//As long as you are not at the end of the text
		while(i < guitext.length()) {
			
			//If it's not a space, keep going
			if(!guitext.substring(i, i+1).equals(" ")) {
				i++;				
			
			//If you do find a space	
			} else {
				
				if(firstSpace == -1) {
					firstSpace = i;
				}
				
				//Loop through again...
				for(int j = i+1; j < guitext.length(); j++) {
					
					//If you find another space...
					if(guitext.substring(j, j+1).equals(" ")) {
						
						if(!guitext.substring(i, j).equals(" ") && !guitext.substring(i, j).equals("")) {
							//Add it to temp
							temp.add(guitext.substring(i+1, j));
						}
						
						//Set i to j, and increment j
						i = j;
					}

				}
				i++;
				if(lastSpace == -1) {
					lastSpace = i;
				}
			}
			
		}
		
		
		//Add the first and last words
		temp.add(0,guitext.substring(0, firstSpace));
		temp.add(guitext.substring(lastSpace));

		
		withoutSpaces.setText("		Without Spaces: " + temp.size());
		
	}

}
