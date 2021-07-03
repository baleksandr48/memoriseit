import React, { FC } from "react";
import { createStyles, makeStyles, Tab, Tabs, Theme } from "@material-ui/core";
import { TopicTableOfContents } from "./table-of-contents";
import { Topic } from "../../store/topic/types";
import { TopicContributors } from "./topic-contributors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexColumn: {
      display: "flex",
      flexDirection: "column"
    }
  })
);

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      className={classes.flexColumn}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

interface Props {
  topic: Topic;
  currentUserEmail: string;
}

export const TopicTabs: FC<Props> = ({ topic, currentUserEmail }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="Articles" />
        <Tab label="Contributors" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <TopicTableOfContents topic={topic} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TopicContributors
          contributors={topic.contributors}
          currentUserEmail={currentUserEmail}
        />
      </TabPanel>
    </>
  );
};
