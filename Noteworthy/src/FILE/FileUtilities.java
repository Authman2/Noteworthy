package FILE;

import java.io.File;

/** This class is responsible for defining which file formats are accepted when loading notes. The method getExtension
 * just returns the extension of the specified file so it can check elsewhere if it is valid. */
public abstract class FileUtilities {

	public static final String txt = "txt";
	public static final String noteworthyfile = "ntwy";
	
	
	public static String getExtension(File f) {
		String ext = "";
		int i = f.getName().indexOf(".");
		
		if(i > 0 && i < f.getName().length() - 1) {
			ext = f.getName().substring(i+1).toLowerCase();
		}
		
		return ext;
	}
}
