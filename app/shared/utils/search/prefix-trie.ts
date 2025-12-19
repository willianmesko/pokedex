type AutocompleteItem = { id: number; name: string };

class TrieNode {
  children = new Map<string, TrieNode>();
  items: AutocompleteItem[] = [];
}

export class PrefixTree {
  private root = new TrieNode();

  insert(word: string, item: AutocompleteItem) {
    let node = this.root;

    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }

    node.items.push(item);
  }

  search(prefix: string, limit = 8): AutocompleteItem[] {
    let node = this.root;

    for (const char of prefix.toLowerCase()) {
      const next = node.children.get(char);
      if (!next) return [];
      node = next;
    }

    return node.items.slice(0, limit);
  }
}
