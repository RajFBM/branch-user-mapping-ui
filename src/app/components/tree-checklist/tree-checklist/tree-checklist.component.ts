import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocationService } from 'app/services/location.service';
import { LocationDetails } from 'app/models/locations';
import { UserDetails } from 'app/models/UserDetails';
import { DataSharedService } from 'app/services/data-shared.service';

export class TodoItemNode {
  children: TodoItemNode[] = [];
  item: string = '';
}

export class TodoItemFlatNode {
  item: string = '';
  level: number = 0;
  expandable: boolean = false;
}

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor(private readonly _locationService: LocationService) {
    this.initialize();
  }

  initialize() {
    this._locationService.getAllLocations()
      .subscribe(async (data: LocationDetails) => {
        const treeData = await this.buildTreeFromApiResponse(data);
        this.dataChange.next(treeData);
      });

  }
  private async buildTreeFromApiResponse(apiData: LocationDetails): Promise<TodoItemNode[]> {
    const treeData: TodoItemNode[] = [];

    const buildTree = (data: LocationDetails): TodoItemNode[] => {
      const node = new TodoItemNode();
      node.item = data.levelName;
      node.children = []; // Initialize the children array

      if (data.children && data.children.length > 0) {
        for (const child of data.children) {
          node.children = node.children.concat(buildTree(child)); // Concatenate child nodes
        }
      }

      return [node];
    };

    treeData.push(...buildTree(apiData));

    return treeData;
  }


  buildFileTree(obj: { [key: string]: any }, level: number): any[] {
    return Object.keys(obj).reduce<any[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(
        {
          ...node,
          otherInfo: key
        }
      );
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({ item: name } as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

@Component({
  selector: 'tree-checklist-example',
  templateUrl: 'tree-checklist.component.html',
  styleUrls: ['tree-checklist.component.css'],
  providers: [ChecklistDatabase]
})
export class TreeChecklistExample implements OnInit {
  [x: string]: any;
  @Output() nodeSelectionList: EventEmitter<TodoItemFlatNode> = new EventEmitter();
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  searchString = ''
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  selectedParent: TodoItemFlatNode | null = null;
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  node: any;
  savedUserLocation: string[] = [];

  constructor(private _database: ChecklistDatabase, private readonly dataSharedService: DataSharedService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;

      this.treeControl.expand(this.treeControl.dataNodes[0])
    });
  }
  ngOnInit(): void {
    this.dataSharedService.userSavedData.subscribe(res => {
      this.savedUserLocation = res;
    });
  }
  shouldCheckCheckbox(node: TodoItemFlatNode): boolean {
    return this.savedUserLocation.includes(node.item);
  }


  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  filterLeafNode(node: TodoItemFlatNode): boolean {
    if (!this.searchString) {
      return false
    }
    return node.item.toLowerCase()
      .indexOf(this.searchString?.toLowerCase()) === -1

  }

  filterParentNode(node: TodoItemFlatNode): boolean {

    if (
      !this.searchString ||
      node.item.toLowerCase().indexOf(this.searchString?.toLowerCase()) !==
      -1
    ) {
      return false
    }
    const descendants = this.treeControl.getDescendants(node)

    if (
      descendants.some(
        (descendantNode) =>
          descendantNode.item
            .toLowerCase()
            .indexOf(this.searchString?.toLowerCase()) !== -1
      )
    ) {
      return false
    }
    return true
  }

  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  todoItemSelectionToggle(node: any): void {

    // Toggle the selection of the clicked node
    this.checklistSelection.toggle(node);
    this.nodeSelectionList.emit(node);
    // Get the parent node
    const parent = this.getParentNode(node);

    // If a parent node exists, recursively update its selection
    if (parent) {
      this.updateParentSelection(parent);
    }
  }

  getParentNode(node: any): any {
    const data = this.treeControl.dataNodes;
    const nodeIndex = data.indexOf(node);

    if (nodeIndex === -1) {
      return null; // Node not found in data
    }

    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (data[i].level < node.level) {
        return data[i];
      }
    }

    return null; // No parent node found
  }

  // Function to update the selection of a parent node based on its children
  updateParentSelection(parent: any): void {
    const children = this.treeControl.getDescendants(parent);
    const allChildrenSelected = children.every((child) =>
      this.checklistSelection.isSelected(child)
    );

    if (allChildrenSelected) {
      this.checklistSelection.select(parent);
    } else {
      this.checklistSelection.deselect(parent);
    }

    // Recursively update the parent's parent, if it exists
    const grandparent = this.getParentNode(parent);
    if (grandparent) {
      this.updateParentSelection(grandparent);
    }
  }

  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.nodeSelectionList.emit(node);
    console.log("todoLeafItemSelectionToggle" + node);
    console.log(JSON.stringify(node));
  }

  checkAllParentsSelection(node: TodoItemFlatNode): void {

    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
      const val = this.checklistSelection.setSelection()
    }
  }

  checkRootNodeSelection(node: TodoItemFlatNode): void {

    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {

      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }


  onNodeSelected(event: any): void {
    const selectedNode = event.option.value; // The selected node
    if (this.checklistSelection.isSelected(selectedNode)) {

      console.log('Selected Node:', selectedNode);
    } else {

      console.log(' Node: Unselected', selectedNode);
    }
  }
}
