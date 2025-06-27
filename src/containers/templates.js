import React, { useEffect } from 'react';
import { Button, Table, message, Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getTemplatesAction } from '../redux/templates/templatesAction';

const ReadyTemplates = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { templates = [], loading = false, error = null } = useSelector(state => state.templates || {});

  useEffect(() => {
    console.log('Templates data:', templates);
    dispatch(getTemplatesAction());
  }, [dispatch]);

  // In your ReadyTemplates component, update handleSeeResults:
  const handleSeeResults = (template) => {
    try {
      console.log('Selected template:', template); // Debug log

      if (!template || !template.formData) {
        throw new Error('Template data is incomplete');
      }

      // Navigate with the full template data
      navigate('/ev-analysis', {
        state: {
          templateData: template.formData, // Pass the actual formData
          originPath: '/templates'
        }
      });
    } catch (error) {
      console.error('Error handling template:', error);
      message.error(error.message || 'Error loading template data');
    }
  };

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
            className="form_btn"
            type="primary"
            onClick={() => handleSeeResults(record)}
            disabled={loading}
          >
            Proceed to Steps
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="templates-container" style={{ padding: '24px' }}>
      <div className="templates-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div className="templates-title">
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Preconfigured EV Load Scenarios</h2>
        </div>
      </div>
      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
      {templates.length === 0 && !loading && !error ? (
        <Empty description="No templates available" />
      ) : (
        <Table
          columns={columns}
          dataSource={templates}
          loading={loading}
          rowKey="id"
          pagination={false}
          size="middle"
          className="templates-table"
          showHeader={true}
        />
      )}
    </div>
  );
};

export default ReadyTemplates;
