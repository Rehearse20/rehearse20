import React from 'react';

import { IconButton, ListItem, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  CallMade,
  CallReceived,
  VolumeOff,
  VolumeUp,
} from '@material-ui/icons';

const useStyles = makeStyles({
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  alignRight: {
    // alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
});

const trxColor = (value) => {
  return typeof value === 'undefined'
    ? 'disabled'
    : value > 0
    ? 'primary'
    : 'error';
};

const MemberItem = ({
  member,
  trxInfo = { 'recv-bandwidth': undefined, 'send-bandwidth': undefined },
  onVolumeClick,
}) => {
  const classes = useStyles();

  const onClick = () => {
    onVolumeClick(member.id);
  };

  return (
    <ListItem>
      <div className={classes.box}>
        {/* <IconButton onClick={onClick}>
          {isRecving ? <VolumeUp /> : <VolumeOff />}
        </IconButton> */}
        {member.name}
        <Box component="span" className={classes.alignRight}>
          <CallReceived
            fontSize="small"
            color={trxColor(trxInfo['recv-bandwidth'])}
          ></CallReceived>
          <CallMade
            fontSize="small"
            color={trxColor(trxInfo['send-bandwidth'])}
          ></CallMade>
        </Box>
      </div>
    </ListItem>
  );
};

export default MemberItem;
