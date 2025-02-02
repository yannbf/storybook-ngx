import { useGlobals, useParameter } from "@storybook/api";
import { IconButton, Icons, TooltipLinkList, WithTooltip } from "@storybook/components";
import React, { FC, Fragment, memo, useCallback, useMemo } from "react";
import { WRAPPERS_PARAM_KEY } from "../constants";
import { getDisplayedItems, getItemByName } from '../helpers';
import { WrappersConfig } from "../types";

const DEFAULT_CONFIG: WrappersConfig = {
  disable: true,
  default: null,
  values: [],
};

export const WrapperSelector: FC<any> = memo(() => {
  const config = useParameter<WrappersConfig>(WRAPPERS_PARAM_KEY, DEFAULT_CONFIG);

  const [globals, updateGlobals] = useGlobals();
  const globalValue = globals[WRAPPERS_PARAM_KEY]?.value;

  const selectedValue = useMemo(() => {
    return getItemByName(globalValue, config.values, config.default).value;
  }, [config, globalValue]);

  const onChange = useCallback(
    (value: string) => {
      updateGlobals({ [WRAPPERS_PARAM_KEY]: { value } });
    },
    [config, globals, updateGlobals]
  );

  if (config.disable === true) {
    return null;
  }

  return (
    <Fragment>
      <WithTooltip
        placement="top"
        trigger="click"
        closeOnClick
        tooltip={({ onHide }) => {
          const links = getDisplayedItems(config.values, selectedValue, ({ selected }) => {
            if (selectedValue !== selected) {
              onChange(selected);
            }
            onHide();
          });
          return (<TooltipLinkList links={links} />);
        }}
      >
        <IconButton
          key="wrapper"
          title="Change the wrapper of the story."
          active={selectedValue !== ''}
        >
          <Icons icon="contrast" />
        </IconButton>
      </WithTooltip>
    </Fragment>
  );
});
