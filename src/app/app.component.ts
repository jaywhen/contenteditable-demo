import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('editor') editor: TemplateRef<HTMLDivElement> | null = null;

  selection: Selection | null = null;

  left = 0;

  top = 0;

  showList = false;

  list = ['asd', 'ddd', 'cc'];

  get range() {
    return this.selection?.getRangeAt(0);
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === '/' || event.key === '{') {
      if (this.range?.getClientRects().length) {
        // get the tip/tmpl list position (global absolute)
        const { left, top } = this.range.getClientRects()[0];
        this.left = left;
        this.top = top;
        this.showList = true;
      }
    } else {
      this.showList = false;
    }
  }

  onClick() {
    const selection = window.getSelection() as Selection;
    this.selection = selection;
    console.log(selection);
  }

  add() {
    const node = document.createElement('span');
    node.className = 'keyWord';
    node.textContent = '{{asd}}';
    this.range?.insertNode(node);
    this.selection?.removeAllRanges();
    this.selection?.collapse(node, 1);
  }

  del() {
    this.range?.deleteContents();
  }

  onSelectItem(item: string) {
    // should handle the selection range case
    const preStartOffset = this.range?.startOffset as number;
    const startNode = this.range?.startContainer as Node;
    startNode.textContent = startNode?.textContent?.slice(
      0,
      startNode?.textContent.length - 1
    ) as string;
    this.range?.setStart(startNode, preStartOffset - 1);

    const node = this.getTmplNode(item);
    this.range?.deleteContents();
    this.range?.insertNode(node);
    this.selection?.removeAllRanges();
    this.selection?.collapse(node, 1);

    this.showList = false;
  }

  private getTmplNode(content: string) {
    const node = document.createElement('span');
    node.textContent = `{{ ${content} }}`;

    return node;
  }
}
