import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { JsonViewerComponent } from './json-viewer/json-viewer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestSchema } from '../../model/request-schema.model';
import { S1Schema } from '../../model/s1-schema.model';
import { RequestSchemaService } from '../../schema-config/services/request-schema.service';
import { S1SchemaService } from '../../schema-config/services/s1schema.service';
import { MappingService } from '../../schema-config/services/mapping.service';
import { ToastService } from '../../../services/toast.service';
import { Mapping } from '../../model/mapping.model';



@Component({
  selector: 'app-mapping',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    JsonViewerComponent
  ],
  templateUrl: './mapping.component.html',
  styleUrl: './mapping.component.scss'
})
export class MappingComponent implements OnInit {
  requestSchemas: RequestSchema[] = [];
  selectedRequestSchemaId: any = null;
  s1Schemas: S1Schema[] = [];
  selectedS1SchemaId: any = null;
  selectedRequestSchema: any;
  selectedS1Schema: any;
  selectedPath: string[] = [];
  mappedPaths: string[][] = [];
  selectedLeftPath: string[] | null = null;
  selectedRightPath: string[] | null = null;
  mapping: { [leftPath: string]: string } = {};
  mappingForm: FormGroup;

  constructor(
    private _requestSchemaService: RequestSchemaService,
    private _s1SchemaService: S1SchemaService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private mappingService: MappingService,
    private toastr: ToastService
  ) {
    this.mappingForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }




  handlePathClick(path: string[], isLeft: boolean) {
    if (isLeft) {
      this.selectedLeftPath = path;
    } else {
      this.selectedRightPath = path;
    }
    if (this.selectedLeftPath && this.selectedRightPath) {
      this.mapping[this.selectedLeftPath.join('.')] = this.selectedRightPath[this.selectedRightPath.length - 1]; // Store only the last element
      this.mappedPaths.push(this.selectedLeftPath);
      this.mappedPaths.push(this.selectedRightPath);
      this.selectedLeftPath = null;
      this.selectedRightPath = null;
    }
  }

  getMappingKeys(): string[] {
    return Object.keys(this.mapping);
  }

  getPathString(path: string[] | null): string {
    return path ? path.join('.') : '';
  }

  openMappingModal(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static' });
  }

  ngOnInit(): void {
     this.getAllRequestSchemas();
  }

  getAllRequestSchemas() {
    this._requestSchemaService.getAllRequestSchemaDTOs().subscribe(
      (res: any) => {
        this.requestSchemas = res.body;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  saveMapping(modal: any) {
    if (this.mappingForm.valid && this.selectedRequestSchemaId) {
      const formValue = this.mappingForm.value;
      const mappingData = JSON.stringify(this.mapping);
      const encodedData = new TextEncoder().encode(mappingData);
      const base64Data = btoa(String.fromCharCode.apply(null, Array.from(encodedData))); // Convert Uint8Array to base64

      const mappingModel: Mapping = {
        name: formValue.name,
        description: formValue.description,
        schemaData: base64Data, // Send base64 string
      };

      this.mappingService.saveMapping(mappingModel, this.selectedRequestSchemaId).subscribe(
        (response) => {
          this.toastr.showToast('Success', 'Mapping Saved successfully', 'success');
          modal.close('save');
          // Handle reset
          this.mapping = {};
        },
        (error) => {
          this.toastr.showToast('Failed', 'Mapping could not be saved', 'success');
          console.error('Error saving mapping:', error);
          // Handle error (e.g., show an error message)
        }
      );
    }
  }


  getAllS1SchemasByRequestSchemaId() { 
    console.log(this.selectedRequestSchemaId);
    if (this.selectedRequestSchema) {
      this._s1SchemaService.getAllS1SchemasByRequestSchemaId(this.selectedRequestSchemaId).subscribe(
        (res: any) => {
          this.s1Schemas = res.body;
        },
        (err) => {
          console.log(err);
        }
      );
    }

  }

  onSelectRequestSchema() {    
    if (this.selectedRequestSchemaId) {
      this._requestSchemaService.getRequestSchemaById(this.selectedRequestSchemaId).subscribe(
        (res) => {
          this.selectedRequestSchema = JSON.parse(res.body.schemaData);
          this.getAllS1SchemasByRequestSchemaId();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onSelectS1Schema() {
    if (this.selectedS1SchemaId) {
      this._s1SchemaService.getS1SchemaById(this.selectedS1SchemaId).subscribe(
        (res) => {
          this.selectedS1Schema = JSON.parse(res.schemaData);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

}
