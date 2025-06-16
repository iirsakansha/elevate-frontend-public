import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, Form, Input, DatePicker, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  getTemplatesAction,
  createTemplateAction,
  updateTemplateAction,
  deleteTemplateAction,
} from '../redux/templates/templatesAction';
import moment from 'moment';

// Define predefined templates
const predefinedTemplates = [
  {
    id: 1,
    name: 'Urban Residential Scenario',
    dateCreated: '2023-01-01T00:00:00.000Z',
    formData: {
      form1: {
        loadCategory: '2',
        isLoadSplit: 'no',
        isLoadSplitFile: '/media/FileUpload/DT_Data_Upload_Cp06j2W.96f49e0c3591ee87bb15.xls', // File upload required
        categoryData: [
          { category: 'residential', specifySplit: '80', salesCAGR: '5' },
          { category: 'commercial', specifySplit: '20', salesCAGR: '3' },
        ],
      },
      form2: {
        numOfvehicleCategory: '4',
        vehicleCategoryData: [
          {
            vehicleCategory: 'car',
            n: '1000',
            f: '1',
            c: '60',
            p: '7',
            e: '90',
            r: '300',
            k: '1080',
            l: '120',
            g: '50',
            h: '10',
            s: '20',
            u: '5',
            CAGR_V: '10',
            baseElectricityTariff: '8',
          },
          {
            vehicleCategory: '2-wheeler',
            n: '5000',
            f: '2',
            c: '3',
            p: '1.5',
            e: '85',
            r: '100',
            k: '1200',
            l: '60',
            g: '20',
            h: '5',
            s: '30',
            u: '10',
            CAGR_V: '15',
            baseElectricityTariff: '7',
          },
          {
            vehicleCategory: 'bus',
            n: '100',
            f: '2',
            c: '200',
            p: '50',
            e: '88',
            r: '250',
            k: '300',
            l: '180',
            g: '150',
            h: '30',
            s: '15',
            u: '5',
            CAGR_V: '8',
            baseElectricityTariff: '9',
          },
          {
            vehicleCategory: '3-wheeler',
            n: '200',
            f: '2',
            c: '10',
            p: '3',
            e: '87',
            r: '120',
            k: '960',
            l: '90',
            g: '40',
            h: '8',
            s: '25',
            u: '7',
            CAGR_V: '12',
            baseElectricityTariff: '7.5',
          },
        ],
      },
      form3: {
        resolution: '15',
        BR_F: '80',
        sharedSavaing: '50',
        sum_pk_cost: '12',
        sum_zero_cost: '8',
        sum_op_cost: '5',
        win_pk_cost: '10',
        win_zero_cost: '7',
        win_op_cost: '4',
      },
      form4: {
        // Store as ISO strings instead of moment objects
        summerDate: ['2025-04-01T00:00:00.000Z', '2025-09-30T00:00:00.000Z'],
        winterDate: ['2025-10-01T00:00:00.000Z', '2025-03-31T00:00:00.000Z'],
        s_pks: '08:00',
        s_pke: '12:00',
        s_sx: '20',
        s_ops: '00:00',
        s_ope: '06:00',
        s_rb: '10',
        w_pks: '18:00',
        w_pke: '22:00',
        w_sx: '15',
        w_ops: '23:00',
        w_ope: '05:00',
        w_rb: '8',
      },
    },
  },
  {
    id: 2,
    name: 'Commercial Fleet Scenario',
    dateCreated: '2023-02-01T00:00:00.000Z',
    formData: {
      form1: {
        loadCategory: '3',
        isLoadSplit: 'no',
        isLoadSplitFile: '/media/FileUpload/DT_Data_Upload_Cp06j2W.96f49e0c3591ee87bb15.xls',
        categoryData: [
          { category: 'commercial', specifySplit: '60', salesCAGR: '4' },
          { category: 'industrial', specifySplit: '30', salesCAGR: '2' },
          { category: 'public', specifySplit: '10', salesCAGR: '3' },
        ],
      },
      form2: {
        numOfvehicleCategory: '4',
        vehicleCategoryData: [
          {
            vehicleCategory: 'car',
            n: '800',
            f: '2',
            c: '50',
            p: '11',
            e: '92',
            r: '250',
            k: '960',
            l: '100',
            g: '60',
            h: '12',
            s: '25',
            u: '6',
            CAGR_V: '9',
            baseElectricityTariff: '9',
          },
          {
            vehicleCategory: '2-wheeler',
            n: '3000',
            f: '1',
            c: '4',
            p: '2',
            e: '90',
            r: '80',
            k: '1080',
            l: '80',
            g: '25',
            h: '6',
            s: '35',
            u: '8',
            CAGR_V: '14',
            baseElectricityTariff: '8',
          },
          {
            vehicleCategory: 'bus',
            n: '150',
            f: '1',
            c: '180',
            p: '60',
            e: '85',
            r: '200',
            k: '240',
            l: '150',
            g: '120',
            h: '25',
            s: '20',
            u: '4',
            CAGR_V: '7',
            baseElectricityTariff: '10',
          },
          {
            vehicleCategory: '3-wheeler',
            n: '250',
            f: '2',
            c: '12',
            p: '4',
            e: '88',
            r: '100',
            k: '900',
            l: '100',
            g: '35',
            h: '7',
            s: '30',
            u: '6',
            CAGR_V: '11',
            baseElectricityTariff: '8.5',
          },
        ],
      },
      form3: {
        resolution: '30',
        BR_F: '85',
        sharedSavaing: '60',
        sum_pk_cost: '15',
        sum_zero_cost: '10',
        sum_op_cost: '6',
        win_pk_cost: '12',
        win_zero_cost: '8',
        win_op_cost: '5',
      },
      form4: {
        summerDate: ['2025-05-01T00:00:00.000Z', '2025-10-31T00:00:00.000Z'],
        winterDate: ['2025-11-01T00:00:00.000Z', '2025-04-30T00:00:00.000Z'],
        s_pks: '09:00',
        s_pke: '13:00',
        s_sx: '25',
        s_ops: '01:00',
        s_ope: '07:00',
        s_rb: '12',
        w_pks: '17:00',
        w_pke: '21:00',
        w_sx: '18',
        w_ops: '22:00',
        w_ope: '04:00',
        w_rb: '10',
      },
    },
  },
  {
    id: 3,
    name: 'Rural Mixed Scenario',
    dateCreated: '2023-03-01T00:00:00.000Z',
    formData: {
      form1: {
        loadCategory: '2',
        isLoadSplit: 'no',
        isLoadSplitFile: '/media/FileUpload/DT_Data_Upload_Cp06j2W.96f49e0c3591ee87bb15.xls',
        categoryData: [
          { category: 'agricultural', specifySplit: '70', salesCAGR: '2' },
          { category: 'residential', specifySplit: '30', salesCAGR: '3' },
        ],
      },
      form2: {
        numOfvehicleCategory: '4',
        vehicleCategoryData: [
          {
            vehicleCategory: 'car',
            n: '500',
            f: '1',
            c: '40',
            p: '7',
            e: '90',
            r: '200',
            k: '1200',
            l: '120',
            g: '40',
            h: '8',
            s: '30',
            u: '7',
            CAGR_V: '6',
            baseElectricityTariff: '6',
          },
          {
            vehicleCategory: '2-wheeler',
            n: '4000',
            f: '1',
            c: '2.5',
            p: '1',
            e: '85',
            r: '70',
            k: '1080',
            l: '60',
            g: '15',
            h: '4',
            s: '40',
            u: '10',
            CAGR_V: '10',
            baseElectricityTariff: '5.5',
          },
          {
            vehicleCategory: 'bus',
            n: '50',
            f: '2',
            c: '150',
            p: '40',
            e: '87',
            r: '180',
            k: '360',
            l: '180',
            g: '100',
            h: '20',
            s: '25',
            u: '5',
            CAGR_V: '5',
            baseElectricityTariff: '7',
          },
          {
            vehicleCategory: '3-wheeler',
            n: '150',
            f: '1',
            c: '8',
            p: '2.5',
            e: '86',
            r: '90',
            k: '960',
            l: '90',
            g: '30',
            h: '6',
            s: '35',
            u: '8',
            CAGR_V: '8',
            baseElectricityTariff: '6.5',
          },
        ],
      },
      form3: {
        resolution: '60',
        BR_F: '75',
        sharedSavaing: '40',
        sum_pk_cost: '10',
        sum_zero_cost: '7',
        sum_op_cost: '4',
        win_pk_cost: '8',
        win_zero_cost: '6',
        win_op_cost: '3',
      },
      form4: {
        summerDate: ['2025-03-01T00:00:00.000Z', '2025-08-31T00:00:00.000Z'],
        winterDate: ['2025-09-01T00:00:00.000Z', '2025-02-28T00:00:00.000Z'],
        s_pks: '07:00',
        s_pke: '11:00',
        s_sx: '15',
        s_ops: '23:00',
        s_ope: '05:00',
        s_rb: '8',
        w_pks: '19:00',
        w_pke: '23:00',
        w_sx: '12',
        w_ops: '00:00',
        w_ope: '06:00',
        w_rb: '6',
      },
    },
  },
  {
    id: 4,
    name: 'Industrial Hub Scenario',
    dateCreated: '2023-04-01T00:00:00.000Z',
    formData: {
      form1: {
        loadCategory: '3',
        isLoadSplit: 'no',
        isLoadSplitFile: '/media/FileUpload/DT_Data_Upload_Cp06j2W.96f49e0c3591ee87bb15.xls',
        categoryData: [
          { category: 'industrial', specifySplit: '50', salesCAGR: '3' },
          { category: 'commercial', specifySplit: '30', salesCAGR: '4' },
          { category: 'residential', specifySplit: '20', salesCAGR: '2' },
        ],
      },
      form2: {
        numOfvehicleCategory: '4',
        vehicleCategoryData: [
          {
            vehicleCategory: 'car',
            n: '1200',
            f: '1',
            c: '55',
            p: '11',
            e: '91',
            r: '270',
            k: '900',
            l: '100',
            g: '70',
            h: '15',
            s: '20',
            u: '5',
            CAGR_V: '8',
            baseElectricityTariff: '10',
          },
          {
            vehicleCategory: '2-wheeler',
            n: '2500',
            f: '2',
            c: '3.5',
            p: '1.8',
            e: '89',
            r: '90',
            k: '1080',
            l: '70',
            g: '20',
            h: '5',
            s: '30',
            u: '7',
            CAGR_V: '12',
            baseElectricityTariff: '9',
          },
          {
            vehicleCategory: 'bus',
            n: '200',
            f: '2',
            c: '220',
            p: '70',
            e: '86',
            r: '230',
            k: '180',
            l: '200',
            g: '140',
            h: '30',
            s: '15',
            u: '4',
            CAGR_V: '6',
            baseElectricityTariff: '11',
          },
          {
            vehicleCategory: '3-wheeler',
            n: '300',
            f: '2',
            c: '15',
            p: '5',
            e: '88',
            r: '110',
            k: '960',
            l: '100',
            g: '45',
            h: '9',
            s: '25',
            u: '6',
            CAGR_V: '10',
            baseElectricityTariff: '9.5',
          },
        ],
      },
      form3: {
        resolution: '15',
        BR_F: '90',
        sharedSavaing: '70',
        sum_pk_cost: '18',
        sum_zero_cost: '12',
        sum_op_cost: '8',
        win_pk_cost: '15',
        win_zero_cost: '10',
        win_op_cost: '6',
      },
      form4: {
        summerDate: ['2025-04-15T00:00:00.000Z', '2025-10-15T00:00:00.000Z'],
        winterDate: ['2025-10-16T00:00:00.000Z', '2025-04-14T00:00:00.000Z'],
        s_pks: '10:00',
        s_pke: '14:00',
        s_sx: '30',
        s_ops: '02:00',
        s_ope: '08:00',
        s_rb: '15',
        w_pks: '16:00',
        w_pke: '20:00',
        w_sx: '20',
        w_ops: '21:00',
        w_ope: '03:00',
        w_rb: '12',
      },
    },
  },
];

// Helper function to serialize formData for safe passing through history
const serializeFormData = (formData) => {
  return JSON.parse(JSON.stringify(formData));
};

export const ReadyTempaltes = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { templates, loading } = useSelector(state => state.templates || { templates: [], loading: false });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getTemplatesAction());
  }, [dispatch]);

  // Use predefined templates if Redux state is empty
  const displayTemplates = templates.length > 0 ? templates : predefinedTemplates;

  const columns = [
    {
      title: 'Scenario name',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      className: 'scenario-name-column',
    },
    {
      title: 'Date created',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      width: '30%',
      render: (date) => moment(date).format('MMM D, YYYY'),
    },
    {
      title: '',
      key: 'actions',
      width: '30%',
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="default"
            size="small"
            className="edit-btn"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            size="small"
            className="see-results-btn"
            onClick={() => handleSeeResults(record)}
          >
            See results
          </Button>
        </div>
      ),
    },
  ];

  const handleAddNewScenario = () => {
    setEditingTemplate(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    form.setFieldsValue({
      name: template.name,
      dateCreated: moment(template.dateCreated),
    });
    setIsModalVisible(true);
  };

  const handleSeeResults = (template) => {
    try {
      // Serialize the formData to ensure it contains only plain objects
      const serializedFormData = serializeFormData(template.formData);

      history.push({
        pathname: '/ev-analysis',
        state: { templateData: serializedFormData },
      });
    } catch (error) {
      console.error('Error serializing template data:', error);
      message.error('Error loading template data. Please try again.');
    }
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const templateData = {
        ...values,
        dateCreated: values.dateCreated.toISOString(),
        id: editingTemplate ? editingTemplate.id : Date.now(),
      };

      if (editingTemplate) {
        dispatch(updateTemplateAction(editingTemplate.id, templateData, () => {
          message.success('Template updated successfully');
          setIsModalVisible(false);
          dispatch(getTemplatesAction());
        }));
      } else {
        dispatch(createTemplateAction(templateData, () => {
          message.success('Template created successfully');
          setIsModalVisible(false);
          dispatch(getTemplatesAction());
        }));
      }
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingTemplate(null);
  };

  return (
    <div className="templates-container">
      <div className="templates-header">
        <div className="templates-title">
          {/* Title can be added here if needed */}
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNewScenario}
          className="add-scenario-btn"
          title="Add a new scenario"
        />
      </div>

      <Table
        columns={columns}
        dataSource={displayTemplates}
        loading={loading}
        rowKey="id"
        pagination={false}
        size="middle"
        className="templates-table"
        showHeader={true}
      />

      <Modal
        title={editingTemplate ? 'Edit Scenario' : 'Add New Scenario'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingTemplate ? 'Update' : 'Create'}
        cancelText="Cancel"
        className="template-modal"
      >
        <Form
          form={form}
          layout="vertical"
          name="template_form"
        >
          <Form.Item
            name="name"
            label="Scenario Name"
            rules={[{ required: true, message: 'Please input scenario name!' }]}
          >
            <Input placeholder="Enter scenario name" />
          </Form.Item>

          <Form.Item
            name="dateCreated"
            label="Date Created"
            rules={[{ required: true, message: 'Please select date!' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="MMM D, YYYY"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};