import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

interface Application {
  IdApplication: string | null;
  IdType: string;
  Name: string;
  Path: string;
}

export default function ApplicationsDemo() {
  const emptyApplication: Application = {
    IdApplication: null,
    IdType: '',
    Name: '',
    Path: '',
  };

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [applicationDialog, setApplicationDialog] = useState<boolean>(false);
  const [deleteApplicationDialog, setDeleteApplicationDialog] =
    useState<boolean>(false);
  const [deleteApplicationsDialog, setDeleteApplicationsDialog] =
    useState<boolean>(false);
  const [application, setApplication] = useState<Application>(emptyApplication);
  const [selectedApplications, setSelectedApplications] = useState<
    Application[]
  >([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Application[]>>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_URL_API_APPLICATIONS
        );
        const data = Array.isArray(response.data.Applications)
          ? response.data.Applications
          : [];
        console.log('Respuesta de data:', data.length);
        setApplications(data);
        setLoading(false);
        console.log('Respuesta del servicio:', data);
      } catch (error) {
        setError(error);
        setLoading(false);
        console.error('Error fetching data from API', error);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  const openNew = () => {
    setApplication(emptyApplication);
    setSubmitted(false);
    setApplicationDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setApplicationDialog(false);
  };

  const hideDeleteApplicationDialog = () => {
    setDeleteApplicationDialog(false);
  };

  const hideDeleteApplicationsDialog = () => {
    setDeleteApplicationsDialog(false);
  };

  const saveApplication = () => {
    setSubmitted(true);

    if (application.Name.trim()) {
      const updatedApplications = [...applications];
      const updatedApplication = { ...application };

      if (application.IdApplication) {
        const index = findIndexById(application.IdApplication);

        updatedApplications[index] = updatedApplication;
        toast.current?.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Application Updated',
          life: 3000,
        });
      } else {
        updatedApplication.IdApplication = createId();
        updatedApplications.push(updatedApplication);
        toast.current?.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Application Created',
          life: 3000,
        });
      }

      setApplications(updatedApplications);
      setApplicationDialog(false);
      setApplication(emptyApplication);
    }
  };

  const editApplication = (application: Application) => {
    setApplication({ ...application });
    setApplicationDialog(true);
  };

  const confirmDeleteApplication = (application: Application) => {
    setApplication(application);
    setDeleteApplicationDialog(true);
  };

  const deleteApplication = () => {
    const updatedApplications = applications.filter(
      (val) => val.IdApplication !== application.IdApplication
    );

    setApplications(updatedApplications);
    setDeleteApplicationDialog(false);
    setApplication(emptyApplication);
    toast.current?.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Application Deleted',
      life: 3000,
    });
  };

  const findIndexById = (id: string) => {
    return applications.findIndex(
      (application) => application.IdApplication === id
    );
  };

  const createId = (): string => {
    let id = '';
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteApplicationsDialog(true);
  };

  const deleteSelectedApplications = () => {
    const updatedApplications = applications.filter(
      (val) => !selectedApplications.includes(val)
    );

    setApplications(updatedApplications);
    setDeleteApplicationsDialog(false);
    setSelectedApplications([]);
    toast.current?.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Applications Deleted',
      life: 3000,
    });
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const val = e.target.value;
    const updatedApplication = { ...application, [name]: val };
    setApplication(updatedApplication);
  };

  /* const onInputTextAreaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    name: string
  ) => {
    const val = e.target.value;
    const updatedApplication = { ...application, [name]: val };
    setApplication(updatedApplication);
  }; */

  const leftToolbarTemplate = () => {
    return (
      <div className='flex flex-wrap gap-2'>
        <Button
          label='Agregar'
          icon='pi pi-plus'
          severity='info'
          onClick={openNew}
        />
        {/* <Button
          label='Editar'
          icon='pi pi-file-edit'
          severity='success'
          onClick={confirmDeleteSelected}
          disabled={!selectedApplications || !selectedApplications.length}
        /> */}
        <Button
          label='Delete'
          icon='pi pi-trash'
          severity='danger'
          onClick={confirmDeleteSelected}
          disabled={!selectedApplications || !selectedApplications.length}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label='Ejecutar Despliegues'
        icon='pi pi-sync'
        className='p-button-help'
        onClick={exportCSV}
      />
    );
  };

  const actionBodyTemplate = (rowData: Application) => {
    return (
      <>
        <Button
          icon='pi pi-pencil'
          rounded
          outlined
          className='mr-2'
          onClick={() => editApplication(rowData)}
        />
        <Button
          icon='pi pi-trash'
          rounded
          outlined
          severity='danger'
          onClick={() => confirmDeleteApplication(rowData)}
        />
      </>
    );
  };

  const header = (
    <div className='flex flex-wrap gap-2 align-items-center justify-between'>
      <h4 className='m-0'>Despliegues a Ejecutar</h4>
      <div className='flex gap-2'>
        <div className='relative'>
          <InputIcon className='pi pi-search absolute left-2 top-1/2 transform -translate-y-1/2' />
          <InputText
            type='search'
            placeholder='Buscar...'
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              setGlobalFilter(target.value);
            }}
            className='pl-8'
          />
        </div>
      </div>
    </div>
  );

  const applicationDialogFooter = (
    <>
      <Button label='Agregar' icon='pi pi-check' onClick={saveApplication} />
      <Button label='Cancelar' icon='pi pi-times' outlined onClick={hideDialog} />
    </>
  );

  const deleteApplicationDialogFooter = (
    <>
      <Button
        label='No'
        icon='pi pi-times'
        outlined
        onClick={hideDeleteApplicationDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        severity='danger'
        onClick={deleteApplication}
      />
    </>
  );

  const deleteApplicationsDialogFooter = (
    <>
      <Button
        label='No'
        icon='pi pi-times'
        outlined
        onClick={hideDeleteApplicationsDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        severity='danger'
        onClick={deleteSelectedApplications}
      />
    </>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className='card'>
        <Toolbar
          className='mb-4'
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={applications}
          selection={selectedApplications}
          onSelectionChange={(e) => {
            if (Array.isArray(e.value)) {
              setSelectedApplications(e.value);
            }
          }}
          dataKey='IdApplication'
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} applications'
          globalFilter={globalFilter}
          header={header}
          selectionMode='multiple'
        >
          <Column selectionMode='multiple' exportable={false}></Column>

          <Column
            field='IdType'
            header='Tipo de despliegue'
            sortable
            style={{ minWidth: '10rem' }}
            body={(rowData) => {
              return rowData.IdType.toString() === '1'
                ? 'WEB'
                : rowData.IdType.toString() === '2'
                ? 'Servicio Distribuido'
                : '';
            }}
          ></Column>

          <Column
            field='Name'
            header='Aplicación'
            sortable
            style={{ minWidth: '16rem' }}
          ></Column>

          <Column
            field='Path'
            header='Path'
            sortable
            style={{ minWidth: '10rem' }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: '12rem' }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={applicationDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Configuración de Despliegue'
        modal
        className='p-fluid'
        footer={applicationDialogFooter}
        onHide={hideDialog}
      >
        <div className='field'>
          <label htmlFor='IdType' className='font-bold'>
            Tipo de despliegue
          </label>

          <InputText
            id='IdType'
            value={application.IdType}
            onChange={(e) => onInputChange(e, 'IdType')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !application.IdType,
            })}
          />
          {submitted && !application.IdType && (
            <small className='p-error'>Tipo de Aplicación es requerido.</small>
          )}
        </div>
        <div className='field'>
          <label htmlFor='Name' className='font-bold'>
            Aplicación
          </label>

          <Dropdown
            value={application.Name}
            onChange={(e: DropdownChangeEvent) => onInputChange(e, 'Name')}
            options={applications.map((app) => ({
              label: app.Name,
              value: app.Name,
            }))}
            placeholder='Seleccione la Aplicación'
            filter
            className='w-full md:w-32rem'
          />
          {submitted && !application.Name && (
            <small className='p-error'>Nombre es requerido.</small>
          )}
        </div>
        <div className='field'>
          <label htmlFor='IdType' className='font-bold'>
            PET/IPR
          </label>

          <InputText
            id='IdType'
            value={application.IdType}
            onChange={(e) => onInputChange(e, 'IdType')}
            required
            autoFocus
            className={classNames({
              'p-invalid': submitted && !application.IdType,
            })}
          />
          {submitted && !application.IdType && (
            <small className='p-error'>Tipo de Aplicación es requerido.</small>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteApplicationDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteApplicationDialogFooter}
        onHide={hideDeleteApplicationDialog}
      >
        <div className='confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-3'
            style={{ fontSize: '2rem' }}
          />
          {application && (
            <span>
              Are you sure you want to delete <b>{application.Name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteApplicationsDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteApplicationsDialogFooter}
        onHide={hideDeleteApplicationsDialog}
      >
        <div className='confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-3'
            style={{ fontSize: '2rem' }}
          />
          {application && (
            <span>
              Are you sure you want to delete the selected applications?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
