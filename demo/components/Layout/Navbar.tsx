import { Navbar as MantineNav } from "@mantine/core";
import { ComponentChildren } from "preact";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import { route } from "preact-router";

interface MainLinkProps {
  icon: ComponentChildren;
  color: string;
  label: string;
  href: string;
}

function MainLink({ icon, color, label, href }: MainLinkProps) {
  return (
    <UnstyledButton
      onClick={() => route(href)}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

export type NavbarProps = {
  children: ComponentChildren;
};

const Navbar = ({ children }: NavbarProps) => {
  return (
    <MantineNav width={{ base: 300 }} height={500} p="xs">
      <MantineNav.Section grow mt="xs">
        <div>{children}</div>
      </MantineNav.Section>
    </MantineNav>
  );
};

Navbar.Link = MainLink;

export default Navbar;
