import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let toStringFormat = vscode.commands.registerCommand('tostringformat.toStringFormat', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const text = document.getText();

			var transformedText = delExtraSpace(text);
			transformedText = format(transformedText);

			editor.edit((editBuilder) => {
				const firstLine = document.lineAt(0);
				const lastLine = document.lineAt(document.lineCount - 1);
				const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
				editBuilder.replace(textRange, transformedText);
			});
		}
	});

	context.subscriptions.push(toStringFormat);
}

function format(source: string): string {
	var lst = new Array<string>;
	formatSub(source, lst, 0);
	return lst.map((item) => item.toString()).join('\n');
}


function formatSub(s: string, lst: Array<string>, tab: number) {
	if (s === null || s === "") {
		return s;
	}

	for (var i = 0; i < s.length; i++) {
		if (s.charAt(i) === '(' || s.charAt(i) === '{' || s.charAt(i) === '[') {
			lst.push(addTab(tab) + s.substring(0, i + 1));
			++tab;
			formatSub(s.substring(i + 1), lst, tab);
			return;
		}
		if (s.charAt(i) === ')' || s.charAt(i) === '}' || s.charAt(i) === ']') {
			if (s.charAt(i + 1) === ',') {
				if (i === 0) {
					--tab;
					lst.push(addTab(tab) + s.substring(0, 3));
					formatSub(s.substring(3), lst, tab);
				} else {
					lst.push(addTab(tab) + s.substring(0, i));
					--tab;
					lst.push(addTab(tab) + s.substring(i, i + 3));
					formatSub(s.substring(i + 3), lst, tab);
				}
				return;
			} else if (i === 0) {
				--tab;
				lst.push(addTab(tab) + s.charAt(0));
				formatSub(s.substring(1), lst, tab);
				return;
			} else {
				lst.push(addTab(tab) + s.substring(0, i));
				formatSub(s.substring(i), lst, tab);
				return;
			}
		}
		if (s.charAt(i) === ',') {
			lst.push(addTab(tab) + s.substring(0, i + 2));
			formatSub(s.substring(i + 2), lst, tab);
			return;
		}
	}
	lst.push(s);

}

function addTab(tab: number) {
	var r = "";
	while (tab > 0) {
		r = r + "	";
		tab--;
	}
	return r;
}

function delExtraSpace(source: string): string {
	source = source.replace(/,/g, ", ");
	source = source.replace(/\r\n/g, '');
	source = source.replace(/\t/g, '');
	source = source.replace(/  /g, " ");
	return source;
}