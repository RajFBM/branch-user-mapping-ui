import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocationService } from 'app/services/location.service';



export class TodoItemNode {
  children: TodoItemNode[] = [];
  item: string = '';
}

export class TodoItemFlatNode {
  item: string ='';
  level: number=0;
  expandable: boolean=false;
}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  Root: {
    Groceries: {
      'Almond Meal flour': null,
      'Organic eggs': null,
      'Protein Powder': null,
      Fruits: {
        Apple: null,
        Berries: ['Blueberry', 'Raspberry'],
        Orange: null
      }
    },
    Reminders: {
      'Cook dinner': null,
      'Read the Material Design spec': null,
      'Upgrade Application to Angular': null,
      Fruits: {
        Apple: null,
        Berries: ['Orange', 'Mango'],
        Orange: null
      }
    },
    Reminders1: {
      'Cook dinner 1': null,
      'Read the Material Design spec 1': null,
      'Upgrade Application to Angular 1': null,
      Fruits: {
        Apple: null,
        Berries: ['Grapes', 'Pomegranate'],
        Orange: null
      }
    },
    Reminders2: {
      'Cook dinner 2': null,
      'Read the Material Design spec 2': null,
      'Upgrade Application to Angular 2': null,
      Fruits: {
        Apple: null,
        Berries: ['Grapes1', 'Pomegranate1'],
        Orange: null
      }
    },
    Reminders3: [
      'Cook dinner 3',
      'Read the Material Design spec 3',
      'Upgrade Application to Angular 3',
    ]
  }
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor(private http: HttpClient, private readonly _locationService:LocationService) {
    this.initialize();
  }

  initialize() {
    // this.http.get('https://d59a23b1-afcb-4265-8761-f4d91b07c713.mock.pstmn.io/get')
    // this.http.get('https://1418e641-5366-4d2d-857d-27359bcbd939.mock.pstmn.io/data')
this._locationService.getAllLocations()
    .subscribe(async (data: any) => {
      const treeData = await this.buildTreeFromApiResponse(data);
      this.dataChange.next(treeData);
    });
  }


  private async buildTreeFromApiResponse(apiData: any): Promise<TodoItemNode[]> {
    const treeData: TodoItemNode[] = [];
  
    const buildTree = (data: any): TodoItemNode[] => {
      return Object.keys(data).map(key => {
        const node = new TodoItemNode();
        // node.item = data[key].leaf_Name;
        node.item = data[key]?.leaf_Name || '';

        const children = data[key];
        if (children && typeof children === 'object') {
          node.children = buildTree(children);
        }
  
        return node;
      });
    };
  
    treeData.push(...buildTree(apiData));
  
    return treeData;
  }

  buildFileTree(obj: {[key: string]: any}, level: number): any[] {
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
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'tree-checklist-example',
  templateUrl: 'tree-checklist.component.html',
  styleUrls: ['tree-checklist.component.css'],
  providers: [ChecklistDatabase]
})
export class TreeChecklistExample {
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

  constructor(private _database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;

      this.treeControl.expand(this.treeControl.dataNodes[0])
    });
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

  // todoItemSelectionToggle(node: TodoItemFlatNode): void {
  //   this.checklistSelection.toggle(node);
  //   const descendants = this.treeControl.getDescendants(node);
  //   this.checklistSelection.isSelected(node)
  //     ? this.checklistSelection.select(...descendants)
  //     : this.checklistSelection.deselect(...descendants);

  //   descendants.forEach(child => this.checklistSelection.isSelected(child));
  //   this.checkAllParentsSelection(node);
  // }

  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    const parent = this.getParentNode(node);
  
    if (parent) {
      const parentSelected = this.checklistSelection.isSelected(parent);
  
      if (!parentSelected) {
        // If the parent is deselected, select only the parent node
        this.checklistSelection.select(parent);
      } else {
        // If the parent is selected, deselect it
        this.checklistSelection.deselect(parent);
      }
  
      // Recursively check parent nodes
      this.checkAllParentsSelection(parent);
    }
  }

  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
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

  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

}
