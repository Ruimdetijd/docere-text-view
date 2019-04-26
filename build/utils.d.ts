declare function fetchXml(url: string): Promise<any>;
declare function wrap(node: Text, index: number, found: string): void;
declare function attrsToObject(attrs: any): any;
export { attrsToObject, fetchXml, wrap, };
