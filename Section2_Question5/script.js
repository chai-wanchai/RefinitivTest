var fs = require('fs');
var filepath = "./existinfile.txt";// you need to save the filepath when you open the file to update without use the filechooser dialog againg

export function writeFileResult(content) {
	fs.writeFile(filepath, content, (err) => {
		if (err) {
			alert("An error ocurred updating the file" + err.message);
			console.log(err);
			return;
		}

		alert("The file has been succesfully saved");
	});
}
