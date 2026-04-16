'use client';

import Link from 'next/link';
import styled from 'styled-components';
import type { Locale } from '@/i18n/config';
import type { Influencer } from '@/data/influencers';
import { Avatar } from './Avatar';
import { formatFollowers } from '@/lib/format';

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 79, 139, 0.3);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Name = styled.h3`
  font-size: 17px;
  margin: 0;
`;

const Handle = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 15px;
    font-weight: 700;
  }
`;

type Props = {
  influencer: Influencer;
  locale: Locale;
  labels: { followers: string; procedures: string };
};

export function InfluencerCard({ influencer, locale, labels }: Props) {
  return (
    <Card href={`/${locale}/influencers/${influencer.slug}`}>
      <TopRow>
        <Avatar gradient={influencer.avatar} label={influencer.name[locale]} size={56} />
        <NameBlock>
          <Name>{influencer.name[locale]}</Name>
          <Handle>@{influencer.handle}</Handle>
        </NameBlock>
      </TopRow>
      <Stats>
        <Stat>
          <strong>{formatFollowers(influencer.followers, locale)}</strong>
          <span>{labels.followers}</span>
        </Stat>
        <Stat>
          <strong>{influencer.procedures.length}</strong>
          <span>{labels.procedures}</span>
        </Stat>
      </Stats>
    </Card>
  );
}
