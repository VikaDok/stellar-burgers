import { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const statusMap: { [key: string]: { text: string; color: string } } = {
    pending: { text: 'Готовится', color: '#E52B1A' },
    done: { text: 'Выполнен', color: '#00CCCC' },
    created: { text: 'Создан', color: '#F2F2F3' }
  };

  const statusData = statusMap[status] || { text: status, color: '#F2F2F3' };

  return <OrderStatusUI textStyle={statusData.color} text={statusData.text} />;
};
